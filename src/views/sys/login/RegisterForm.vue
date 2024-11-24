<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" :is-delivery="$props.isdelivery" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="username" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem name="phoneNumber" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phoneNumber"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="captcha" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.captcha"
          :placeholder="t('sys.login.smsCode')"
          :sendCodeApi="sendSms"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <ARow class="fix-auto-fill" :gutter="[16, 16]" justify="center">
        <ACol block>
          <a-button
            type="primary"
            size="large"
            @click="handleRegister(false)"
            @mouseenter="loading = true"
          >
            注册为用户
          </a-button>
        </ACol>
        <ACol block>
          <a-button size="large" @click="handleRegister(true)" @mouseenter="loading = true">
            注册为配送员
          </a-button>
        </ACol>
      </ARow>

      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox, message, Col, Row } from 'ant-design-vue';
  import { StrengthMeter } from '@/components/StrengthMeter';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { UserRegisterApi } from '@/api/user/self';
  import { deliveryPersonRegisterApi } from '@/api/delivery/self';
  import { sendSmsApi } from '@/api/sms/aliSmsService';
  import { CountdownInput } from '@/components/CountDown';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    captcha: '',
    policy: false,
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister(isDelivery: boolean) {
    const data = await validForm();
    if (!data) return;
    console.log('resgister data', data);
    if (isDelivery) {
      await deliveryPersonRegisterApi(data).then(() => {
        message.success('注册成功');
        handleBackLogin();
      });
    } else {
      await UserRegisterApi(data).then(() => {
        message.success('注册成功');
        handleBackLogin();
      });
    }
    console.log(data);
  }

  async function sendSms() {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      message.error('请输入正确的手机号');
      return;
    }
    console.log('sendSms');
    await sendSmsApi({ phoneNumber: formData.phoneNumber });
    return true;
  }
</script>

<style>
  .button-container {
    display: flex; /* 使用 flex 布局 */
    justify-content: center;
    gap: 10px; /* 按钮之间的间距 */
  }

  .button-container button {
    flex: none; /* 确保按钮宽度自动根据内容调整 */
  }
</style>
