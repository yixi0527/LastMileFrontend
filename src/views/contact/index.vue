<template>
  <PageWrapper :class="prefixCls" title="联系客服">
    <template #headerContent>
      <Alert message="如果您遇到任何问题，请扫码添加客服微信与我们沟通" show-icon closable />
    </template>

    <div :class="`${prefixCls}__container`">
      <img src="@/assets/images/wechatContact.jpg" alt="微信二维码" class="responsive-img" />
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Alert } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';

  const prefixCls = 'list-search';
</script>

<style lang="less" scoped>
  .list-search {
    &__container {
      padding: 12px;
      background-color: @component-background;
      text-align: center; // 中心对齐
    }
  }

  .responsive-img {
    max-width: 100%; // 图片宽度不超过容器宽度
    height: auto; // 自动调整高度以保持宽高比
  }
</style>
