import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { LoginParams } from '../sys/model/sysmodel';

enum Api {
  AdminGetUserList = '/admin/getUserList',
  AdminUpdateUserInfo = '/admin/updateUserById',
  AdminDeleteUser = '/admin/deleteUserByIds',
  AdminCreateUser = '/admin/createUser',
}

export function AdminGetUserListApi(params: any, mode: ErrorMessageMode = 'modal') {
  if (params.AdminID === 1) {
    delete params['AdminID'];
  }
  return defHttp.get<any>(
    {
      url: Api.AdminGetUserList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminUpdateUserInfoApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<any>(
    {
      url: Api.AdminUpdateUserInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminDeleteUserApi(params: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete<any>(
    {
      url: Api.AdminDeleteUser + '?' + `${params}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminCreateUserApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.AdminCreateUser,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
