import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_ID_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { UserInfoModel } from '@/api/model/userModel';
import { doLogout, getUserInfo, UserloginApi, UserSmsloginApi } from '@/api/user/self';
import {
  deliveryPersonloginApi,
  DeliverySmsloginApi,
  getDeliveryPersonInfo,
} from '@/api/delivery/self';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import { LoginParams } from '@/api/sys/model/sysmodel';
import { DeliveryPersonInfoModel } from '@/api/model/deliveryModel';
import { adminloginApi, getAdminInfo } from '@/api/admin/self';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfoModel | DeliveryPersonInfoModel {
      return state.userInfo || getAuthCache<UserInfoModel>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getUserId(state): number {
      return state.userInfo?.userID || getAuthCache<string | number>(USER_ID_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserID(id: string | number) {
      this.userInfo = { ...this.userInfo, userID: id };
      setAuthCache(USER_ID_KEY, id);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.$state.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode;
        isDelivery?: boolean;
        isAdmin?: boolean;
        isMobile?: boolean;
        gohome?: boolean;
      },
    ): Promise<UserInfoModel | DeliveryPersonInfoModel | null> {
      try {
        const { mode, isDelivery, isAdmin, isMobile, ...loginParams } = params;
        let data;
        if (isAdmin) {
          data = await adminloginApi(loginParams, mode);
          this.setUserID(data.adminID);
        } else if (!isDelivery) {
          data = isMobile
            ? await UserSmsloginApi(loginParams, mode)
            : await UserloginApi(loginParams, mode);
          this.setUserID(data.userID);
        } else {
          data = isMobile
            ? await DeliverySmsloginApi(loginParams, mode)
            : await deliveryPersonloginApi(loginParams, mode);
          this.setUserID(data.deliveryPersonID);
        }
        // const { token } = data;
        const token = 'token';
        // save token
        this.setToken(token);
        return this.afterLoginAction(true, isDelivery, isAdmin);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(
      goHome?: boolean,
      isDelivery?: boolean,
      isAdmin?: boolean,
    ): Promise<UserInfoModel | DeliveryPersonInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction(isAdmin, isDelivery);
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }
        // goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
        goHome && (await router.replace(userInfo?.homePath));
      }
      return userInfo;
    },
    async getUserInfoAction(isAdmin?: Boolean, isDelivery?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      let userInfo;
      if (isAdmin) {
        await getAdminInfo({ adminID: this.getUserId }).then((res) => (userInfo = res));
        userInfo.homePath = '/admin/analysis';
        if (this.getUserId == 1) {
          this.setRoleList([RoleEnum.SUPER]);
        } else {
          this.setRoleList([RoleEnum.ADMIN]);
        }
        this.setUserInfo(userInfo);
      } else if (isDelivery) {
        await getDeliveryPersonInfo({ deliveryPersonID: this.getUserId }).then(
          (res) => (userInfo = res),
        );
        userInfo.homePath = '/avaliableOrders';
        // this.setUserID(userInfo.deliveryPersonID);
        this.setRoleList([RoleEnum.DeliveryPerson]);
        this.setUserInfo(userInfo);
      } else {
        await getUserInfo({ userID: this.getUserId }).then((res) => (userInfo = res));
        userInfo.homePath = '/order/createOrder';
        // this.setUserID(userInfo.userID);
        this.setRoleList([RoleEnum.USER]);
        this.setUserInfo(userInfo);
      }
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
