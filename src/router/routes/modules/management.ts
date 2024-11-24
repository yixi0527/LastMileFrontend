import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';

const createOrder: AppRouteModule = {
  path: '/admin/management',
  name: 'management',
  component: LAYOUT,
  redirect: '/admin/management',
  meta: {
    orderNo: 1,
    title: '管理',
    icon: 'noto:eyes',
    roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
  },
  children: [
    {
      path: '/admin/user',
      name: 'userPage',
      component: () => import('@/views/admin/user.vue'),
      meta: {
        title: '用户管理',
        // hideMenu: true,
        icon: 'emojione:man-and-woman-holding-hands',
      },
    },
    {
      path: '/admin/delivery',
      name: 'deliveryPage',
      component: () => import('@/views/admin/delivery.vue'),
      meta: {
        title: '配送员管理',
        icon: 'emojione:horse-racing',
      },
    },
    {
      path: '/admin/order',
      name: 'orderPage',
      component: () => import('@/views/admin/order.vue'),
      meta: {
        title: '订单管理',
        // hideMenu: true,
        icon: 'fluent-emoji:card-file-box',
      },
    },
    {
      path: '/admin/platformAdmin',
      name: 'platformAdminPage',
      component: () => import('@/views/admin/platformAdmin.vue'),
      meta: {
        title: '平台管理员管理',
        // hideMenu: true,
        icon: 'twemoji:face-with-monocle',
        roles: [RoleEnum.SUPER],
      },
    },
  ],
};

export default createOrder;
