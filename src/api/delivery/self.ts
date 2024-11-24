import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { DeliveryPersonInfoModel, DeliveryPersonLoginResultModel } from '@/api/model/deliveryModel';
import { LoginParams } from '../sys/model/sysmodel';

enum Api {
  LoginAsDelivery = '/delivery/login',
  SmsLoginAsDelivery = '/delivery/smsLogin',
  GetDeliveryInfo = '/delivery/profile',
  UpdateDeliveryInfo = '/delivery/update',
  DeliveryRegister = '/delivery/register',
  CompleteInfo = '/delivery/completeInfo',
  Logout = '/logout',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function deliveryPersonloginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<DeliveryPersonLoginResultModel>(
    {
      url: Api.LoginAsDelivery,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function DeliverySmsloginApi(
  params: { phoneNumber: string; captcha: string },
  mode: ErrorMessageMode = 'modal',
) {
  console.log('sms login api params', { params });
  const res = defHttp.post<DeliveryPersonLoginResultModel>(
    {
      url: Api.SmsLoginAsDelivery,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  console.log('sms login api response', { res });
  return res;
}

/**
 * @description: getUserInfo
 */
export function getDeliveryPersonInfo(params: { deliveryPersonID: number }) {
  return defHttp.get<DeliveryPersonInfoModel>(
    { url: Api.GetDeliveryInfo, params },
    { errorMessageMode: 'none' },
  );
}
export function deliveryUpdateInfo(params: Partial<DeliveryPersonInfoModel>) {
  return defHttp.post<{ status: string; message: string; data: any }>(
    { url: Api.UpdateDeliveryInfo, params },
    { errorMessageMode: 'modal' },
  );
}

export function deliveryPersonRegisterApi(
  params: Partial<DeliveryPersonInfoModel>,
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<DeliveryPersonLoginResultModel>(
    {
      url: Api.DeliveryRegister,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export function deliveryCompleteInfo(
  params: { username: string; password: string; phoneNumber: string },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post(
    {
      url: Api.CompleteInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
