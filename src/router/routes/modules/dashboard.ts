import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';

const dashboard: AppRouteModule = {
  path: '/admin/dashboard',
  name: 'dashboard',
  component: LAYOUT,
  redirect: '/admin/analysis',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 1,
    title: '仪表盘',
    icon: 'carbon:dashboard',
    roles: [RoleEnum.ADMIN, RoleEnum.SUPER],
  },
  children: [
    {
      path: '/admin/analysis',
      name: 'dashboardPage',
      component: () => import('@/views/dashboard/analysis/index.vue'),
      meta: {
        title: '仪表盘',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
