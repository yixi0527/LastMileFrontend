import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const myOrder: AppRouteModule = {
  path: '/myOrder',
  name: 'myOrder',
  component: LAYOUT,
  redirect: '/myOrder/createOrder',
  meta: {
    orderNo: 2,
    icon: 'flat-color-icons:list',
    title: t('order.basic.myOrder'),
    roles: [RoleEnum.USER],
  },

  children: [
    {
      path: '/myOrder/waitingPayment',
      name: 'waitingPayment',
      component: () => import('@/views/order/showOrder/waitingPaymentOrder.vue'),
      meta: {
        title: t('order.basic.waitingPayment'),
      },
    },
    {
      path: '/myOrder/running',
      name: 'running',
      component: () => import('@/views/order/showOrder/runningOrder.vue'),
      meta: {
        title: t('order.basic.running'),
      },
    },
    {
      path: '/myOrder/waitingReview',
      name: 'waitingReview',
      component: () => import('@/views/order/showOrder/waitingReview.vue'),
      meta: {
        title: t('order.basic.waitingReview'),
      },
    },
    {
      path: '/myOrder/all',
      name: 'all',
      component: () => import('@/views/order/showOrder/allOrder.vue'),
      meta: {
        title: t('order.basic.all'),
      },
    },
  ],
};

export default myOrder;
