<template>
  <div class="result-container">
    <Result status="success" title="操作成功" sub-title="系统确认付款中，请稍候。">
      <template #extra>
        <a-button @click="() => pay()">查看收款码</a-button>
        <a-button @click="() => showOrderDetails()">查看订单</a-button>
      </template>
    </Result>
  </div>
  <ImageModal ref="payModal" :orderID="orderID" :type="'pay'" :cancle="false" :showAction="false" />
  <OrderDetailModal ref="orderModal" :userID="1" :orderID="orderID" />
</template>

<script lang="ts" setup>
  import { Result } from 'ant-design-vue';
  import OrderDetailModal from '@/components/Modal/src/OrderDetailModal.vue';
  import { defineEmits, ref } from 'vue';
  import ImageModal from '@/components/Modal/src/ImageModal.vue';

  const payModal = ref<typeof ImageModal>();
  const pay = () => {
    if (payModal.value) {
      payModal.value.show();
    }
  };
  const isPayModalVisible = ref(false);
  function showPaymentCode() {
    isPayModalVisible.value = true;
  }
  const { orderID } = defineProps<{
    orderID: number;
  }>();

  const orderModal = ref<typeof OrderDetailModal>();
  const showOrderDetails = () => {
    if (orderModal.value) {
      orderModal.value.show(orderID);
    }
  };
  // const emit = defineEmits(['redo']);
</script>

<style lang="less" scoped>
  .result-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 16px;
  }

  @media (max-width: 768px) {
    .result-container {
      padding: 8px;
    }

    .ant-result-title {
      font-size: 18px;
    }

    .ant-result-subtitle {
      font-size: 14px;
    }

    .ant-btn {
      width: 100%;
      margin-bottom: 8px;
    }
  }

  @media (max-width: 480px) {
    .ant-result-title {
      font-size: 16px;
    }

    .ant-result-subtitle {
      font-size: 12px;
    }

    .ant-btn {
      margin-bottom: 4px;
    }
  }
</style>
