<template>
  <PageWrapper :class="prefixCls" title="待付款订单">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="modifiedSchemas"
        :showActionButtonGroup="false"
      />
      <Alert message="点击订单即可扫码付款" show-icon closable />
    </template>

    <div :class="`${prefixCls}__container`">
      <List>
        <template v-for="item in filteredList" :key="item.id">
          <List.Item @click="() => pay(item.orderID)">
            <List.Item.Meta>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  {{ item.note }}
                </div>
                <div :class="`${prefixCls}__action`">
                  <template v-for="(action, index) in actions" :key="action.icon">
                    <div :class="`${prefixCls}__action-item`">
                      <Icon
                        v-if="action.icon"
                        :class="`${prefixCls}__action-icon`"
                        :icon="action.icon"
                        :color="action.color"
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
    <ImageModal
      ref="payModal"
      :userID="userID"
      :orderID="selectedOrderID"
      :type="'pay'"
      :cancle="true"
      :show-action="true"
      @action="handleAction"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { List, Alert } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { BasicForm } from '@/components/Form';
  import { actions, schemas } from './data';
  import { PageWrapper } from '@/components/Page';
  import { ref, computed, onMounted } from 'vue';
  import { getStatusText } from '@/utils/getStatusText';
  import { UserGetOrdersApi } from '@/api/user/orders';
  import ImageModal from '@/components/Modal/src/ImageModal.vue';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  const userID = userStore.getUserId;
  const payModal = ref<typeof ImageModal>();
  const selectedOrderID = ref<number>(0);

  const pay = (orderID: number) => {
    if (payModal.value) {
      selectedOrderID.value = orderID;
      payModal.value.show(orderID);
    }
  };
  const search = ref<string>('');
  const orderList = ref<any[]>([]); // 用于存储订单数据
  const handleAction = ({ action }: { action: 'ok' | 'cancel' | 'cancelOrder' }) => {
    if (action === 'ok' || action === 'cancelOrder') {
      setTimeout(() => {
        fetchOrders();
      }, 10000);
    }
  };

  const fetchOrders = async () => {
    const response = await UserGetOrdersApi({ userID: userID, orderID: null }); // 调用获取订单数据的接口
    orderList.value = response;
  };

  // 在组件挂载时调用fetchOrders
  onMounted(() => {
    fetchOrders();
  });

  const filterByStatus = (list: typeof orderList.value) => {
    return list?.filter((item) => item.status === 1);
  };

  const filterBySearch = (list: typeof orderList.value, searchContext: string) => {
    if (!searchContext) {
      return list;
    } else {
      return list?.filter(
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
