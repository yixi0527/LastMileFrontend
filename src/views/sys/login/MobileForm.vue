<template>
  <div v-if="getShow">
    <!-- <LoginFormTitle class="enter-x" :is-delivery="isDelivery" /> -->
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
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
    </Form>
    <ARow class="enter-x" :gutter="[16, 16]" justify="center">
      <ACol block>
        <Button
          type="primary"
          size="large"
          @click="handleLogin(props.isDelivery)"
          :loading="loading"
        >
          登录/注册
        </Button>
      </ACol>
    </ARow>
    <ARow class="enter-x" :gutter="[16, 16]" justify="center" style="margin-top: 15px">
      <p style="margin: auto; color: gray"> 未注册手机验证后自动创建账号 </p>
    </ARow>

    <!-- <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>
    <Button block @click="setLoginState(LoginStateEnum.LOGIN)">
      <Icon icon="material-symbols:person" />
      {{ t('sys.login.userNamepwdSignInFormTitle') }}
    </Button>
    <Divider class="enter-x" /> -->

    <registerThenLogin
      v-model:visible="registerVisibel"
      :phoneNumber="formData.phoneNumber"
      :is-delivery="isDelivery"
    />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Form, Input, Button, Row, Col, Divider } from 'ant-design-vue';
  import { CountdownInput } from '@/components/CountDown';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import message from '@/views/form-design/utils/message';
  import { sendSmsApi } from '@/api/sms/aliSmsService';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import registerThenLogin from '@/components/Modal/src/registerThenLogin.vue';

  const props = defineProps<{
    isDelivery: boolean;
  }>();
  const { prefixCls } = useDesign('login');
  const { notification, createErrorModal } = useMessage();
  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const { setLoginState } = useLoginState();
  const registerVisibel = ref(false);

  const formRef = ref();
  const loading = ref(false);
  const userStore = useUserStore();
  const formData = reactive({
    phoneNumber: '',
    captcha: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  async function handleLogin(isDelivery: boolean) {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        phoneNumber: data.phoneNumber,
        captcha: data.captcha,
        mode: 'none',
        isDelivery: isDelivery,
        isMobile: true,
        gohome: true,
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.username}`,
          duration: 3,
        });
      }
    } catch (error) {
      if (error.message == '用户不存在' || error.message == '配送员不存在') {
        registerVisibel.value = true;
      } else {
        createErrorModal({
          title: t('sys.api.errorTip'),
          content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      }
    } finally {
      loading.value = false;
    }
  }

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
