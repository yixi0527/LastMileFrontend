<template>
  <PageWrapper :class="prefixCls" title="全部历史订单">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="modifiedSchemas"
        :showActionButtonGroup="false"
      />
      <Alert message="点击列表订单查看详情" show-icon closable />
    </template>
    <div :class="`${prefixCls}__container`">
      <List>
        <template v-for="item in filteredList" :key="item.id">
          <List.Item @click="() => showOrderDetails(item.orderID)">
            <List.Item.Meta>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  {{ item.note }}
                </div>
                <div :class="`${prefixCls}__list-item`">
                  <template v-for="(action, index) in actions" :key="action.icon">
                    <div :class="`${prefixCls}__action-item`">
                      <Icon
                        v-if="action.icon"
                        :class="`${prefixCls}__action-icon`"
                        :icon="action.icon"
                        :color="'black'"
                      />
                      {{ action.text }}
                      <span v-if="index === 0">{{ item.pickupAddress }}</span>
                      <span v-if="index === 1">{{ item.deliveryAddress }}</span>
                      <span v-if="index === 2">{{ getStatusText(item.status) }}</span>
                      <span v-if="index === 3">{{ item.price }} 元</span>
                      <span v-if="index === 4">
                        {{ item.createdTime.replace('T', ' ') }}
                      </span>
                    </div>
                  </template>
                </div>
              </template>
              <template #title>
                <p :class="`${prefixCls}__title`">
                  {{ item.itemInfo }}
                </p>
              </template>
            </List.Item.Meta>
          </List.Item>
        </template>
      </List>
    </div>
    <OrderDetailModal ref="orderModal" :userID="userID" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { List, Alert } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '@/components/Form';
  import { actions, schemas } from './data';
  import { PageWrapper } from '@/components/Page';
  import { ref, computed, onMounted, watch } from 'vue';
  import { getStatusText } from '@/utils/getStatusText';
  import { pollingUserGetOrdersApi } from '@/api/user/orders';
  import OrderDetailModal from '@/components/Modal/src/OrderDetailModal.vue';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  const userID = userStore.getUserId;
  const search = ref<string>('');
  const selectedStatus = ref<number>(-1);
  const orderList = ref<any[]>([]); // 用于存储订单数据
  const orderModal = ref<typeof OrderDetailModal>();

  const showOrderDetails = (orderID: number) => {
    if (orderModal.value) {
      orderModal.value.show(orderID);
    }
  };

  const fetchOrders = async () => {
    const { data, run } = pollingUserGetOrdersApi(
      { userID: userID, orderID: null },
      'modal',
      60000,
    );
    watch(data, (newData) => {
      if (newData) {
        orderList.value = sortByCreatedTime(newData); // 将获取的数据存储在 orderList 中
      }
    });
    run();
  };

  onMounted(() => {
    fetchOrders();
  });

  const filterByStatus = (list: typeof orderList.value, status: number) => {
    if (status === -1) {
      return list;
    } else {
      return list.filter((item) => item.status === status);
    }
  };

  const filterBySearch = (list: typeof orderList.value, searchContext: string) => {
    if (!searchContext) {
      return list;
    } else {
      return list.filter(
        (item) =>
          item.itemInfo.includes(searchContext) ||
          item.note?.includes(searchContext) ||
          item.pickupAddress.includes(searchContext) ||
          item.deliveryAddress.includes(searchContext),
      );
    }
  };

  const sortByCreatedTime = (list: typeof orderList.value) => {
    return list.sort((a, b) => {
      return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    });
  };

  const handleStatusChange = (status: number) => {
    if (status === undefined) {
      selectedStatus.value = -1;
    } else {
      selectedStatus.value = status;
    }
  };

  const handleSearch = (searchContext: string) => {
    search.value = searchContext;
  };
  const filteredList = computed(() => {
    const listFilteredBySearch = filterBySearch(orderList.value, search.value);
    const listFilteredByStatus = filterByStatus(listFilteredBySearch, selectedStatus.value);
    return listFilteredByStatus;
  });

  const modifiedSchemas = schemas.map((schema) => {
    if (schema.field === 'status') {
      return {
        ...schema,
        componentProps: {
          ...schema.componentProps,
          onChange: handleStatusChange,
        },
      };
    } else if (schema.field === 'search') {
      return {
        ...schema,
        componentProps: {
          ...schema.componentProps,
          onSearch: handleSearch,
        },
      };
    }
    return schema;
  });

  const prefixCls = 'list-search';
</script>

<style lang="less" scoped>
  .list-search {
    &__header {
      &-form {
        margin-bottom: -16px;
      }
    }

    &__container {
      padding: 12px;
      background-color: @component-background;
    }

    &__title {
      margin-bottom: 0;
      font-size: 18px;
    }

    &__content {
      color: @text-color-secondary;
    }

    &__action {
      margin-top: 10px;

      &-item {
        display: block;
        padding: 4px 0;
        // color: @text-color-secondary;
        color: black;

        &:nth-child(1) {
          padding-left: 0;
        }

        &:nth-child(1),
        &:nth-child(2) {
          border-right: 1px solid @border-color-base;
        }
      }

      &-icon {
        margin-right: 3px;
      }
    }

    &__time {
      position: absolute;
      right: 20px;
      margin-bottom: 10px;
      color: rgb(0 0 0 / 45%);
    }
  }
</style>
