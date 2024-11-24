import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { LoginParams } from '../sys/model/sysmodel';

enum Api {
  LoginAsAdmin = '/admin/login',
  GetAdminInfo = '/admin/getPlatformAdminById',
}

/**
 * @description: user login api
 */
export function adminloginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  console.log(params);
  return defHttp.post<any>(
    {
      url: Api.LoginAsAdmin,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getAdminInfo(params: { adminID: number }) {
  return defHttp.get<any>(
    { url: Api.GetAdminInfo + '/' + `${params.adminID}` },
    { errorMessageMode: 'none' },
  );
}
