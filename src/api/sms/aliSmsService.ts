import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  SendSms = '/sendSms',
}

/**
 * @description: create order api
 */
export function sendSmsApi(params: { phoneNumber: string }, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.SendSms,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
