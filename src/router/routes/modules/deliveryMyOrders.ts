import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const myOrder: AppRouteModule = {
  path: '/deliveryMyOrder',
  name: 'deliveryMyOrder',
  component: LAYOUT,
  redirect: '/deliveryMyOrder',
  meta: {
    orderNo: 2,
    icon: 'flat-color-icons:list',
    title: t('order.basic.myOrder'),
    roles: [RoleEnum.DeliveryPerson],
  },
  children: [
    {
      path: '/myOrder/acceptedOrders',
      name: 'acceptedOrders',
      component: () => import('@/views/order/myOrder/acceptedOrder.vue'),
      meta: {
        title: '当前订单',
      },
    },
    {
      path: '/myOrder/historyOrders',
      name: 'historyOrders',
      component: () => import('@/views/order/myOrder/historyOrder.vue'),
      meta: {
        title: '历史订单',
      },
    },
  ],
};

export default myOrder;
