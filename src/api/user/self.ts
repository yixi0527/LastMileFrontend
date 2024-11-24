import { defHttp } from '@/utils/http/axios';
import { LoginParams } from '../sys/model/sysmodel';
import { UserLoginResultModel, UserInfoModel, UserRegisterModel } from '@/api/model/userModel';

import { ErrorMessageMode } from '#/axios';
import { func } from 'vue-types';

enum Api {
  LoginAsUser = '/user/login',
  SmsLoginAsUser = '/user/smsLogin',
  RegisterAsUser = '/user/register',
  CompleteInfo = '/user/completeInfo',
  GetUserInfo = '/user/profile',
  UserResetPassword = '/user/resetPassword',

  UpdateUserInfo = '/user/update',
  Logout = '/logout',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function UserloginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  const res = defHttp.post<UserLoginResultModel>(
    {
      url: Api.LoginAsUser,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  return res;
}

export function UserSmsloginApi(
  params: { phoneNumber: string; captcha: string },
  mode: ErrorMessageMode = 'none',
) {
  const res = defHttp.post<UserLoginResultModel>(
    {
      url: Api.SmsLoginAsUser,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  console.log('sms login res', res);
  return res;
}

export function UserRegisterApi(params: UserRegisterModel, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<UserLoginResultModel>(
    {
      url: Api.RegisterAsUser,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function UserCompleteInfo(
  params: { username: string; password: string; phoneNumber: string },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<UserLoginResultModel>(
    {
      url: Api.CompleteInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function UserResetPassword(
  params: { phoneNumber: string; password: string; captcha: string },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<UserLoginResultModel>(
    {
      url: Api.UserResetPassword,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getUserInfo(params: { userID: number }) {
  console.log('get userinfo params', { params });
  const res = defHttp.get<UserInfoModel>(
    { url: Api.GetUserInfo, params },
    { errorMessageMode: 'modal' },
  );
  console.log('get userinfo res', res);
  return res;
}

export function userUpdateInfo(params: UserInfoModel) {
  console.log('update user info params', { params });
  return defHttp.post<{ status: string; message: string; data: any }>(
    { url: Api.UpdateUserInfo, params },
    { errorMessageMode: 'modal' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
