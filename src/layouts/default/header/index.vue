<template>
  <!-- <Layout.Header :style="{ height: headerHeight + 'px' }" />
  <MyScrollBar /> -->
  <!-- <Layout.Header :class="getHeaderClass"></Layout.Header> -->
  <Layout.Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`" style="gap: 20px">
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
      <AppDarkModeToggle class="enter-x mr-2" v-if="!sessionTimeout" />
      <!-- <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      /> -->
      <!-- <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" /> -->
    </div>
    <!-- left end -->

    <!-- menu start -->
    <!-- <div v-if="getShowTopMenu && !getIsMobile" :class="`${prefixCls}-menu`">
      <LayoutMenu
        :isHorizontal="true"
        :theme="getHeaderTheme"
        :splitType="getSplitType"
        :menuMode="getMenuMode"
      />
    </div> -->
    <!-- menu-end -->

    <!-- action  -->
    <div>
      <Switch
        v-if="userStore.getRoleList[0] === RoleEnum.DeliveryPerson"
        v-model:checked="checked"
        checked-children="可接单"
        unChecked-children="不接单"
        @change="startWork"
      />
      <UserDropDown :theme="getHeaderTheme" style="" />
    </div>
  </Layout.Header>
</template>
<script lang="ts" setup>
  import { Layout, Switch } from 'ant-design-vue';
  import { computed, unref, ref, provide } from 'vue';

  import { AppLogo, AppDarkModeToggle, AppLocalePicker } from '@/components/Application';
  import { SettingButtonPositionEnum } from '@/enums/appEnum';
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useLocale } from '@/locales/useLocale';
  import { propTypes } from '@/utils/propTypes';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';
  import { LayoutBreadcrumb, Notify, UserDropDown } from './components';
  import { deliveryUpdateInfo } from '@/api/delivery/self';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';

  const headerHeight = ref(21);
  provide('headerHeight', headerHeight);
  const updateHeaderHeight = (height) => {
    headerHeight.value = height;
  };
  provide('updateHeaderHeight', updateHeaderHeight);
  const userStore = useUserStore();
  const checked = ref<boolean>(userStore.getUserInfo?.status === 2);
  defineOptions({ name: 'LayoutHeader' });

  const props = defineProps({
    fixed: propTypes.bool,
  });
  const { prefixCls } = useDesign('layout-header');
  const { getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } =
    useMenuSetting();
  const { getShowSettingButton, getSettingButtonPosition } = useRootSetting();

  const { getHeaderTheme, getShowContent, getShowHeader } = useHeaderSetting();

  const { getShowLocalePicker } = useLocale();

  const { getIsMobile } = useAppInject();

  const getHeaderClass = computed(() => {
    const theme = unref(getHeaderTheme);
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
        [`${prefixCls}--${theme}`]: theme,
      },
    ];
  });

  const getShowSetting = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return unref(getShowHeader);
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  });

  const getLogoWidth = computed(() => {
    if (!unref(getIsMixMode) || unref(getIsMobile)) {
      return {};
    }
    const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
    return { width: `${width}px` };
  });

  const getSplitType = computed(() => {
    return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  });

  const getMenuMode = computed(() => {
    return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
  });

  function startWork() {
    console.log(checked.value);
    if (!checked.value) {
      deliveryUpdateInfo({
        status: 1,
        deliveryPersonID: userStore.getUserId,
      });
      userStore.setUserInfo({ status: 1 });
    } else {
      deliveryUpdateInfo({
        status: 2,
        deliveryPersonID: userStore.getUserId,
      });
      userStore.setUserInfo({ status: 2 });
    }
  }
</script>
<style lang="less">
  @import url('./index.less');
</style>
