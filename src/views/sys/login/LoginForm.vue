<template>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    :isDelivery="false"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="username" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.username"
        :placeholder="'用户名'"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'left' }">
          <router-link v-if="props.isDelivery" to="/login"> 用户端登录 </router-link>
          <router-link v-else to="/dlogin"> 配送员端登录 </router-link>
        </FormItem>
      </ACol>

      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <ARow class="enter-x" :gutter="[16, 16]" justify="center">
      <ACol block>
        <a-button
          type="primary"
          size="large"
          @click="handleLogin(props.isDelivery)"
          @mouseenter="loading = true"
        >
          登录
        </a-button>
      </ACol>
    </ARow>
  </Form>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import { Form, Input, Row, Col, Button } from 'ant-design-vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';

  const props = defineProps<{
    isDelivery: boolean;
  }>();

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    username: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin(isDelivery: boolean) {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.username,
        mode: 'none',
        isDelivery: isDelivery,
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
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
  // onMounted(() => {
  //   setLoginState(LoginStateEnum.MOBILE);
  // });
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
