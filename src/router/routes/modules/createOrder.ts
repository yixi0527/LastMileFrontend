import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const createOrder: AppRouteModule = {
  path: '/order',
  name: 'Order',
  component: LAYOUT,
  redirect: '/order/createOrder',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 1,
    title: t('order.basic.create'),
    icon: 'emojione:beating-heart',
    roles: [RoleEnum.USER],
  },
  children: [
    {
      path: 'createOrder',
      name: 'createOrderPage',
      component: () => import('@/views/order/createOrder/index.vue'),
      meta: {
        title: t('order.basic.create'),
        hideMenu: true,
      },
    },
  ],
};

export default createOrder;
