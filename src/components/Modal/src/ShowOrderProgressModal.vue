<template>
  <a-modal :open="visible" @cancel="handleCancel" footer="" title="订单状态" width="500px">
    <ARow class="enter-x" :gutter="[16, 8]" justify="center">
      <ACol block>
        <div class="step-form-form">
          <Steps :current="currentStep" direction="vertical">
            <Steps.Step title="待接单" />
            <Steps.Step title="待取货" />
            <Steps.Step title="送货中" />
            <Steps.Step title="已送达" />
            <Steps.Step title="已收货" />
          </Steps>
        </div>
      </ACol>
      <ACol block v-if="currentStep === 0">
        <p>订单已创建，等待系统派单。</p>
      </ACol>
      <ACol block v-if="currentStep === 1">
        <p>跑腿小哥正在去取货的路上~</p>
      </ACol>
      <ACol block v-if="currentStep === 2">
        <p>你的商品离你越来越近啦</p>
      </ACol>
      <ACol block v-if="currentStep === 3">
        <p>商品已送到，收货后请点击确认收货！</p>
        <a-button type="primary" @click="confirmReceipt">确认收货</a-button>
      </ACol>
      <ACol block v-if="currentStep === 4">
        <p>订单已完成！</p>
      </ACol>
    </ARow>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message, Modal, Steps } from 'ant-design-vue';
  import { OrderModel } from '@/api/model/orderModel';
  import { UserGetOrdersApi, UserUpdateOrderApi } from '@/api/user/orders';
  import ARow from 'ant-design-vue/es/grid/Row';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  const userID = userStore.getUserId;
  const visible = ref(false);
  const orderDetails = ref<OrderModel | null>(null);
  const currentStep = ref(0);

  const emit = defineEmits(['newStatus']);
  const fetchOrderDetails = async (orderID: number) => {
    try {
      await UserGetOrdersApi({ userID: userID, orderID: orderID }).then((res) => {
        orderDetails.value = res[0];
        currentStep.value = orderDetails.value.status - 2;
        visible.value = true;
      });
    } catch (error) {
      console.error('Failed to fetch order details', error);
    }
  };

  const handleCancel = () => {
    visible.value = false;
  };

  const confirmReceipt = () => {
    Modal.confirm({
      title: '确认收货',
      content: '您确定要确认收货吗？',
      onOk() {
        message.success('收货成功，您可在待评价订单菜单中进行评价！');
        if (orderDetails.value) {
          UserUpdateOrderApi({
            status: 6,
            orderID: orderDetails.value.orderID,
            userID: userID,
          });
          orderDetails.value.status = 6;
          currentStep.value = 4;

          emit('newStatus', 6);
        }
      },
    });
  };

  const show = (orderID: number) => {
    fetchOrderDetails(orderID);
  };

  defineExpose({ show });
</script>

<style scoped>
  .ant-modal-content {
    padding: 12px;
  }

  .step-form-form {
    width: 360px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .ant-modal-content {
      padding: 8px;
    }

    .step-form-form {
      width: 100%;
      padding: 0 16px;
    }

    .ant-btn {
      width: 100%;
      margin-bottom: 8px;
    }

    .ant-steps-item-title {
      font-size: 14px;
    }

    .ant-steps-item-description {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .step-form-form {
      width: 100%;
      padding: 0 8px;
    }

    .ant-steps-item-title {
      font-size: 12px;
    }

    .ant-steps-item-description {
      font-size: 10px;
    }

    .ant-btn {
      margin-bottom: 4px;
    }
  }
</style>
