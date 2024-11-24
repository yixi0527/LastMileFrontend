import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  AdminGetPlatformAdminList = '/admin/getPlatformAdminList',
  AdminUpdatePlatformAdminInfo = '/admin/updatePlatformAdmin',
  AdminDeletePlatformAdmin = '/admin/deletePlatfromAdminByIds',
  AdminCreatePlatformAdmin = '/admin/createPlatformAdmin',
}

export function AdminGetPlatformAdminListApi(params: any, mode: ErrorMessageMode = 'modal') {
  if (params.AdminID === 1) {
    delete params['AdminID'];
  }
  const ret = defHttp.get<any>(
    {
      url: Api.AdminGetPlatformAdminList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  return ret;
}

export function AdminUpdatePlatformAdminInfoApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<any>(
    {
      url: Api.AdminUpdatePlatformAdminInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminDeletePlatformAdminApi(params: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete<any>(
    {
      url: Api.AdminDeletePlatformAdmin + '?' + `${params}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminCreatePlatformAdminApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.AdminCreatePlatformAdmin,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
