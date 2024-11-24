<template>
  <div class="icon-container" style="margin-right: 10px">
    <span
      :class="[prefixCls, `${prefixCls}--${theme}`]"
      class="flex items-center"
      @click="showModal"
    >
      <Icon
        icon="streamline:interface-help-customer-support-2-customer-headphones-headset-help-microphone-phone-person-support"
        :class="[`iconColor--${theme}`]"
        style="font-size: 24px"
      />
    </span>

    <Modal v-model:open="open" centered :footer="null" :width="'300px'" :title="'联系客服'">
      <img src="@/assets/images/wechatContact.jpg" alt="客服" class="support-image" />
    </Modal>
    <!-- 第二个图标的下拉框 -->
    <Dropdown
      placement="bottomLeft"
      :overlayClassName="`${prefixCls}-dropdown-overlay`"
      style="width: 40px"
    >
      <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex items-center">
        <Icon icon="ion:power-outline" style="font-size: 24px" :class="[`iconColor--${theme}`]" />
      </span>

      <template #overlay>
        <Menu @click="handleMenuClick" style="width: 110px">
          <MenuItem key="logout" :text="'退出登录'" icon="ion:power-outline" />
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>
<script lang="ts" setup>
  import { Dropdown, Menu, Modal } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { computed, ref } from 'vue';
  import { DOC_URL } from '@/settings/siteSetting';
  import { useUserStore } from '@/store/modules/user';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import { propTypes } from '@/utils/propTypes';
  import { openWindow } from '@/utils';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import Icon from '@/components/Icon/Icon.vue';

  const open = ref(false);
  const showModal = () => {
    open.value = true;
  };
  type MenuEvent = 'logout' | 'doc' | 'lock' | 'api';

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  // const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));
  // const ChangeApi = createAsyncComponent(() => import('../ChangeApi/index.vue'));

  defineOptions({ name: 'UserDropdown' });

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']).isRequired,
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const userStore = useUserStore();

  const [register, { openModal }] = useModal();
  const [registerApi, { openModal: openApiModal }] = useModal();

  function handleLock() {
    openModal(true);
  }

  function handleApi() {
    openApiModal(true, {});
  }

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  // open doc
  function openDoc() {
    openWindow(DOC_URL);
  }

  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut();
        break;
      case 'doc':
        openDoc();
        break;
      case 'lock':
        handleLock();
        break;
      case 'api':
        handleApi();
        break;
    }
  }
</script>
<style lang="less">
  /* Media query for smaller screens */
  @media (max-width: 768px) {
    .support-description {
      font-size: 15px; /* Adjust font size for smaller screens */
    }
  }

  .icon-container {
    display: flex;
    align-items: center;
    gap: 10px; /* Adjust the spacing between icons */
  }

  /* 样式用于调整弹窗内容 */
  .support-dropdown {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 50vw; /* Ensure the dropdown does not exceed viewport width */
    max-height: 60vh; /* Ensure the dropdown does not exceed viewport height */
    // padding: 10px;
    // border: 1px solid #808080; /* Add a 2px solid black border */
  }

  .support-image {
    max-width: 100%; /* Ensure the image scales with the dropdown */
    max-height: 60vh; /* Adjust as needed to fit within viewport height */
    object-fit: contain; /* Ensure the image maintains its aspect ratio */
  }

  .support-description {
    width: 250px;
    // margin-top: 10px;
    background-color: #fff;
    color: #333;
    font-size: 20px;
    text-align: center;
  }

  .iconColor {
    &--dark {
      color: rgb(219 213 213);
    }

    &--light {
      color: black;
    }
  }

  .@{prefix-cls} {
    align-items: center;
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }

  @prefix-cls: ~'@{namespace}-header-user-dropdown';
</style>
