import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import a from '@/views/order/createOrder/index.vue';

const createOrder: AppRouteModule = {
  path: '/profile',
  name: 'profile',
  component: LAYOUT,
  redirect: '/accountSetting',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 3,
    title: t('sys.basic.account'),
    icon: 'emojione:smiling-face-with-sunglasses',
    roles: [RoleEnum.USER, RoleEnum.DeliveryPerson],
  },
  children: [
    {
      path: '/accountSetting',
      name: 'accountSettingPage',
      component: () => import('@/views/account/setting/index.vue'),
      meta: {
        title: t('sys.basic.account'),
        // hideMenu: true,
      },
    },
  ],
};

export default createOrder;
