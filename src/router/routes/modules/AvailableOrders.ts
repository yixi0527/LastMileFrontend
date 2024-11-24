import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const avaliableOrders: AppRouteModule = {
  path: '/avaliabeOrders',
  name: 'avaliableOrders',
  component: LAYOUT,
  redirect: '/avaliableOrders',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 1,
    title: t('可接订单'),
    icon: 'twemoji:money-bag',
    roles: [RoleEnum.DeliveryPerson],
  },
  children: [
    {
      path: '/avaliableOrders',
      name: 'avaliableOrders',
      component: () => import('@/views/order/avaliableOrder/index.vue'),
      meta: {
        title: '可接订单',
        hideMenu: true,
      },
    },
  ],
};

export default avaliableOrders;
