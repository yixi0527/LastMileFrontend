<template>
  <PageWrapper :class="prefixCls" title="进行中订单">
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
          <List.Item @click="() => showModal(item.orderID)">
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
    <ShowOrderProgressModal
      ref="orderModalRef"
      :userID="userID"
      :orderID="selectedOrderID"
      @close="isModalVisible = false"
      @new-status="handleNewStatus"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { List, Alert, message } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '@/components/Form';
  import { actions, schemas } from './data';
  import { PageWrapper } from '@/components/Page';
  import { ref, computed, onMounted, watch } from 'vue';
  import { getStatusText } from '@/utils/getStatusText';
  import { getUserID } from '@/utils/auth';
  import ShowOrderProgressModal from '@/components/Modal/src/ShowOrderProgressModal.vue';
  import { UserGetOrdersApi, pollingUserGetOrdersApi } from '@/api/user/orders';

  import { tabListData } from './tabListData';

  const orderModalRef = ref();
  const selectedOrderID = ref<number>(0);
  const isModalVisible = ref<boolean>(false);

  const showModal = (orderID: number) => {
    selectedOrderID.value = orderID;
    orderModalRef.value.show(orderID);
  };

  const search = ref<string>('');
  const orderList = ref<any[]>([]); // 用于存储订单数据
  const userID = getUserID();
  const processedOrderIds = new Set<number>();
  const handleNewStatus = async () => {
    await UserGetOrdersApi({ userID: userID, orderID: null }).then((res) => {
      isModalVisible.value = false;
      orderList.value = res;
    });
  };

  const fetchOrders = async () => {
    const { data, run } = pollingUserGetOrdersApi(
      { userID: userID, orderID: null },
      'modal',
      60000,
    );

    // 监听 data 的变化并更新 orderList
    watch(data, (newData) => {
      if (newData) {
        orderList.value = sortByCreatedTime(newData); // 将获取的数据存储在 orderList 中
      }
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].status === 5 && !processedOrderIds.has(newData[i].orderID)) {
          // 如果订单状态为 5 且尚未处理过
          message.success('订单已完成,请点击下方列表确认收货');
          // 将订单 ID 添加到 Set 中
          processedOrderIds.add(newData[i].orderID);
        }
      }
    });
    run();
  };

  // 在组件挂载时调用fetchOrders
  onMounted(() => {
    fetchOrders();
  });

  const filterByStatus = (list: typeof orderList.value) => {
    return list.filter(
      (item) => item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5,
    );
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

  const filteredList = computed(() => {
    const listFilteredBySearch = filterBySearch(orderList.value, search.value);
    const listFilteredByStatus = filterByStatus(listFilteredBySearch);
    return listFilteredByStatus;
  });
  const sortByCreatedTime = (list: typeof orderList.value) => {
    return list.sort((a, b) => {
      return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
    });
  };
  const handleSearch = (searchContext: string) => {
    search.value = searchContext;
  };

  const modifiedSchemas = computed(() => {
    return schemas
      .filter((schema) => schema.field === 'search')
      .map((schema) => {
        return {
          ...schema,
          onSearch: handleSearch,
        };
      });
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
