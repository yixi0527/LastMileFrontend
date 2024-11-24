<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
    <div v-if="LoginState === LoginStateEnum.RESET_PASSWORD">
      <p v-if="props.isDelivery">重置密码(配送员端)</p>
      <p v-else>重置密码</p>
      <!-- {{ t('sys.login.forgetFormTitle') }} -->
    </div>
    <div v-else-if="LoginState === LoginStateEnum.LOGIN">
      <p v-if="props.isDelivery">密码登录(配送员端)</p>
      <p v-else>密码登录</p>
      <!-- {{ t('sys.login.signInFormTitle') }} -->
    </div>
    <div v-else-if="LoginState === LoginStateEnum.REGISTER">
      <p v-if="props.isDelivery">注册(配送员端)</p>
      <p v-else>注册</p>
      <!-- {{ t('sys.login.signUpFormTitle') }} -->
    </div>
    <div v-else-if="LoginState === LoginStateEnum.MOBILE">
      <p v-if="props.isDelivery">短信登录(配送员端)</p>
      <p v-else>短信登录</p>
      <!-- {{ t('sys.login.mobileSignInFormTitle') }} -->
    </div>
  </h2>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState } from './useLogin';

  const { t } = useI18n();
  const props = defineProps<{
    isDelivery: boolean;
  }>();
  const { getLoginState } = useLoginState();
  const LoginState = unref(getLoginState);

  // const getFormTitle = computed(() => {
  //   const titleObj = {
  //     [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
  //     // [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
  //     [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
  //     [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
  //     [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
  //     [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
  //   };
  //   return titleObj[unref(getLoginState)];
  // });
</script>
