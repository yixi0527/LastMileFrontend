<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="phoneNumber" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phoneNumber"
          :placeholder="t('sys.login.mobile')"
        />
      </FormItem>
      <FormItem name="captcha" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.captcha"
          :placeholder="t('sys.login.smsCode')"
          :sendCodeApi="sendSms"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.password"
          :placeholder="'请输入新密码'"
          type="password"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '@/components/CountDown';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum, useFormValid } from './useLogin';
  import { sendSmsApi } from '@/api/sms/aliSmsService';
  import message from '@/views/form-design/utils/message';
  import { UserResetPassword } from '@/api/user/self';

  async function sendSms() {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      message.error('请输入有效的手机号');
      return;
    }
    await sendSmsApi({ phoneNumber: formData.phoneNumber }).then((res) => {
      if (res) {
        message.success('验证码发送成功');
      }
    });
    return true;
  }
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    password: '',
    phoneNumber: '',
    captcha: '',
  });

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);
  const { validForm } = useFormValid(formRef);
  async function handleReset() {
    const data = await validForm();
    await UserResetPassword(data)
      .then(() => {
        message.success('密码重置成功');
        handleBackLogin();
      })
      .catch((err) => {
        message.error(err);
      });
  }
</script>
