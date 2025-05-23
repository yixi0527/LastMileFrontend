import { Persistent, BasicKeys } from '@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY, USER_ID_KEY, ROLES_KEY } from '@/enums/cacheEnum';
import projectSetting from '@/settings/projectSetting';
import { RoleEnum } from '@/enums/roleEnum';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getRole() {
  return getAuthCache<RoleEnum[]>(ROLES_KEY);
}

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getUserID() {
  return getAuthCache<number>(USER_ID_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
