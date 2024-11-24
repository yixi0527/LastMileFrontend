import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const contact: AppRouteModule = {
  path: '/contact',
  name: 'contact',
  component: LAYOUT,
  redirect: '/contactSupport',
  meta: {
    hideChildrenInMenu: true,
    orderNo: 4,
    title: t('联系客服'),
    icon: 'twemoji:face-blowing-a-kiss',
    roles: [RoleEnum.DeliveryPerson, RoleEnum.USER],
  },
  children: [
    {
      path: '/contactSupport',
      name: 'contact',
      component: () => import('@/views/contact/index.vue'),
      meta: {
        title: '联系客服',
        hideMenu: true,
      },
    },
  ],
};

export default contact;
