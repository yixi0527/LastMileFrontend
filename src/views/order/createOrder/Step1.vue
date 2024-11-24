<template>
  <div class="step1">
    <div class="step1-form">
      <BasicForm @register="register" />
    </div>
  </div>
  <Divider />
  <h3>说明</h3>
  <p>
    1.下单时请确认<strong style="color: red"> 取货码/取餐码 </strong
    >填写正确，若有特殊需求请备注明确。
  </p>
  <p>
    2.平台主要运营范围为
    <strong style="color: red"> 东华大学松江校区</strong>，其它位置请联系客服下单。
  </p>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '@/components/Form';
  import { step1Schemas } from './data';
  import { defineEmits, ref, computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { UserGetOrdersApi } from '@/api/user/orders';
  import message from '@/views/form-design/utils/message';

  const props = defineProps<{
    created: boolean;
  }>();
  const userStore = useUserStore();
  const emit = defineEmits(['next']);
  const loading = ref<boolean>(false);
  const submitButtonOptions = computed(() => ({
    text: '下一步',
    loading,
  }));

  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: step1Schemas,
    actionColOptions: {
      span: 14,
    },
    showResetButton: false,
    submitButtonOptions: submitButtonOptions.value,

    submitFunc: customSubmitFunc,
  });

  async function customSubmitFunc() {
    loading.value = true;
    await UserGetOrdersApi({ userID: userStore.getUserId, orderID: null }).then(async (res) => {
      if (props.created === false && res?.some((order) => order.status === 1)) {
        message.warning('您有未支付订单，请先在“待付款订单”菜单中支付或取消', 4);
        loading.value = false;
        return;
      } else {
        try {
          const values = await validate();
          emit('next', values);
        } catch (error) {
          loading.value = false;
        }
      }
    });
  }
</script>

<style lang="less" scoped>
  .step1 {
    &-form {
      width: 450px;
      margin: 0 auto;

      @media (max-width: 768px) {
        width: 100%; // 在移动端占满宽度
        padding: 0 16px; // 添加左右内边距
      }
    }

    h3 {
      margin: 0 0 12px;
      color: @text-color-base;
      font-size: 16px;
      line-height: 32px;

      @media (max-width: 768px) {
        font-size: 14px; // 在移动端缩小字体大小
        line-height: 28px;
      }
    }

    h4 {
      margin: 0 0 4px;
      color: @text-color-base;
      font-size: 14px;
      line-height: 22px;

      @media (max-width: 768px) {
        font-size: 12px; // 在移动端缩小字体大小
        line-height: 20px;
      }
    }

    p {
      color: @text-color-base;

      @media (max-width: 768px) {
        font-size: 14px; // 在移动端调整字体大小
        line-height: 24px;
      }
    }
  }

  .pay-select {
    width: 20%;
  }

  .pay-input {
    width: 70%;

    @media (max-width: 768px) {
      width: 100%; // 在移动端让这些元素占满宽度
    }
  }
</style>
