<template>
  <div class="order-container">
    <Alert message="请确认以下信息无误，付款后无法修改" show-icon />
    <div class="order-summary mt-5">
      <p style="width: 100%"><strong>取货地点：</strong>{{ order.pickupAddress }}</p>
      <p style="width: 100%; color: red"><strong>收货地点：</strong>{{ order.deliveryAddress }}</p>
      <p style="width: 100%"><strong>联系电话：</strong>{{ order.phoneNumber }}</p>
      <p style="width: 100%"><strong>物品信息：</strong>{{ order.itemInfo }}</p>
      <p style="width: 100%; color: red"
        ><strong>取货码/取餐码：</strong>
        <span v-if="order.pickupCode">{{ order.pickupCode }}</span>
        <span v-else>无</span>
      </p>

      <p style="width: 100%"
        ><strong>备注：</strong>
        <span v-if="order.note">{{ order.note }}</span>
        <span v-else>无</span>
      </p>

      <p style="width: 100%"><strong>价格：</strong>{{ order.price }} 元</p>
    </div>
    <Divider />
    <div class="button-container">
      <a-button @click="customResetFunc">上一步</a-button>
      <a-button @click="() => pay()" type="primary">支付</a-button>
      <ImageModal
        ref="payModal"
        :orderID="order.orderID"
        :type="'pay'"
        :show-action="true"
        @action="handleAction"
        :cancle="false"
      />
    </div>
  </div>
  <Divider />
  <h3>说明</h3>
  <h4>金额计算规则</h4>
  <p> 1元起步价+0.005*配送距离(米)，四舍五入到0.01元。 </p>
  <h4>跑腿费支付方式</h4>
  <p>
    点击支付，会弹出微信收款码，请按照提示保存图片并扫码支付相应的金额。<br />因每个订单的金额不同，我们将依据收款金额确认订单支付与否。
  </p>
</template>

<script lang="ts" setup>
  import { defineEmits, onMounted, ref } from 'vue';
  import ImageModal from '@/components/Modal/src/ImageModal.vue';
  import { Divider, Alert } from 'ant-design-vue';
  import { UserGetOrdersApi } from '@/api/user/orders';
  import { useUserStore } from '@/store/modules/user';
  import { OrderModel } from '@/api/model/orderModel';
  import { color } from 'echarts';

  const order = ref<OrderModel>();
  const userStore = useUserStore();
  const fetchOrder = (orderID: number) => {
    UserGetOrdersApi({ userID: userStore.getUserId, orderID: orderID }).then((res) => {
      order.value = res[0];
    });
  };
  onMounted(() => {
    fetchOrder(props.orderID);
  });

  const payModal = ref<typeof ImageModal>();
  const pay = () => {
    if (payModal.value) {
      payModal.value.show();
    }
  };
  const props = defineProps<{
    orderID: number;
  }>();
  const emit = defineEmits(['next', 'prev']);

  async function customResetFunc() {
    emit('prev', props.orderID);
  }

  function handleAction({
    action,
  }: {
    action: 'ok' | 'cancel';
    type: 'pay' | 'contact';
    orderID: number;
  }) {
    if (action === 'ok') {
      emit('next');
    }
  }
</script>

<style lang="less" scoped>
  /* 媒体查询 */
  @media (max-width: 768px) {
    .order-container {
      padding: 8px; /* 缩小内边距，确保在小屏幕上有更多可用空间 */
    }

    .order-summary {
      font-size: 14px; /* 缩小字体大小以适应小屏幕 */
    }

    .button-container {
      flex-direction: column; /* 垂直排列按钮 */
      gap: 12px; /* 调整按钮间距 */
      align-items: stretch; /* 按钮宽度拉伸以填满容器 */
    }
  }

  @media (max-width: 480px) {
    .order-summary {
      font-size: 12px; /* 进一步缩小字体以适应更小屏幕 */
    }

    .button-container {
      gap: 8px; /* 缩小按钮间距 */
    }
  }

  .order-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }

  .order-summary {
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 4px;
    background-color: #f5f5f5;

    p {
      margin: 8px 0;
    }

    strong {
      font-weight: bold;
    }
  }

  .button-container {
    display: flex;
    gap: 16px;
    justify-content: space-between;
  }
</style>
