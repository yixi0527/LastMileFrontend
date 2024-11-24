<template>
  <PageWrapper :class="prefixCls" title="待评价订单">
    <template #headerContent>
      <BasicForm
        :class="`${prefixCls}__header-form`"
        :labelWidth="100"
        :schemas="modifiedSchemas"
        :showActionButtonGroup="false"
      />
      <Alert message="点击列表订单去评价" show-icon closable />
    </template>

    <div :class="`${prefixCls}__container`">
      <List>
        <template v-for="item in filteredList" :key="item.id">
          <List.Item @click="() => showReviewModal(item.orderID)">
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
                    </div>
                  </template>

                  <span :class="`${prefixCls}__time`">
                    下单于 {{ item.createdTime.replace('T', ' ') }}
                  </span>
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
    <!-- <OrderDetailModal ref="orderModal" :userID="userID" :orderID="selectedOrderID" /> -->
    <ReviewOrderModal ref="reviewModal" @refresh-orders="fetchOrders" />
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
  import { getUserID } from '@/utils/auth';
  import { UserGetOrdersApi } from '@/api/user/orders';
  import ReviewOrderModal from '@/components/Modal/src/ReviewOrderModal.vue';

  const reviewModal = ref<typeof ReviewOrderModal>();

  function showReviewModal(orderID: number) {
    if (reviewModal.value) {
      reviewModal.value.show(orderID);
    }
  }

  const search = ref<string>('');
  const orderList = ref<any[]>([]); // 用于存储订单数据
  const userID = getUserID();
  // 获取订单数据的函数
  const fetchOrders = async () => {
    console.log('userID', userID);
    const response = await UserGetOrdersApi({ userID: userID }); // 调用获取订单数据的接口
    console.log('response', response);
    orderList.value = response; // 将获取的数据存储在 orderList 中
  };

  // 在组件挂载时调用fetchOrders
  onMounted(() => {
    fetchOrders();
  });

  // 暴露fetchOrders函数给子组件调用
  defineExpose({ fetchOrders });

  const filterByStatus = (list: typeof orderList.value) => {
    return list.filter((item) => item.status === 6);
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
