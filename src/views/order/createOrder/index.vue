<template>
  <PageWrapper
    title="创建订单"
    contentBackground
    content="即便不曾踏出房门，我们也能到达天涯海角。"
    contentClass="p-4"
  >
    <div class="step-form-form">
      <Steps :current="current">
        <Steps.Step title="填写订单信息" />
        <Steps.Step title="确认信息并付款" />
        <Steps.Step title="系统确认付款" />
      </Steps>
    </div>
    <div class="mt-5">
      <Step1
        @next="handleStep1Next"
        v-show="current === 0"
        v-if="state.initStep1"
        :created="created"
      />
      <Step2
        @prev="handleStepPrev"
        @next="handleStep2Next"
        v-show="current === 1"
        :orderID="orderID"
        :loading="loading"
        v-if="state.initStep2"
      />
      <Step3 v-show="current === 2" @redo="handleRedo" v-if="state.initStep3" :orderID="orderID" />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import Step1 from './Step1.vue';
  import Step2 from './Step2.vue';
  import Step3 from './Step3.vue';
  import { PageWrapper } from '@/components/Page';
  import { Steps } from 'ant-design-vue';
  import { UserCreateOrderApi, UserUpdateOrderApi } from '@/api/user/orders';
  import { useUserStore } from '@/store/modules/user';
  import { OrderModel } from '@/api/model/orderModel';

  const userStore = useUserStore();
  defineOptions({ name: 'FormStepPage' });
  const loading = ref(false);
  const current = ref(0);
  const created = ref<boolean>(false);
  const orderID = ref<number>(-1);
  const createdOrder = ref<OrderModel>();
  const state = reactive({
    initStep1: true,
    initStep2: false,
    initStep3: false,
  });

  function handleStep1Next(step1Values: any) {
    createdOrder.value = {
      ...step1Values,
      pickupAddress: step1Values.pickupAddress.join('/'),
      deliveryAddress: step1Values.deliveryAddress.join('/'),
      userID: userStore.getUserId,
      orderID: orderID.value,
    };
    if (created.value) {
      UserUpdateOrderApi({ ...createdOrder.value }).then(() => {
        state.initStep1 = false;
        state.initStep2 = true;
        current.value++;
      });
    } else {
      UserCreateOrderApi({ ...createdOrder.value }).then((res) => {
        orderID.value = res.orderID;
        state.initStep1 = false;
        state.initStep2 = true;
        current.value++;
      });
    }
  }

  function handleStepPrev(_orderID: number) {
    orderID.value = _orderID;
    state.initStep1 = true;
    state.initStep2 = false;
    current.value--;
    created.value = true;
  }

  function handleStep2Next() {
    current.value++;
    state.initStep2 = false;
    state.initStep3 = true;
  }

  function handleRedo() {
    current.value = 0;
    // state.initStep2 = false;
    state.initStep3 = false;
  }
</script>

<style lang="less" scoped>
  .step-form-content {
    padding: 24px;
    background-color: @component-background;
  }

  .step-form-form {
    width: 750px;
    margin: 0 auto;
  }
</style>
