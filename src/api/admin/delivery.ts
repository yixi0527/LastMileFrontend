import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';

enum Api {
  AdminGetDeliveryList = '/admin/getDyPersonList',
  AdminUpdateDeliveryInfo = '/admin/updateDyPersonById',
  AdminDeleteDelivery = '/admin/deleteDeliveryPersonByIds',
  AdminCreateDelivery = '/admin/createDyPerson',
}

export function AdminGetDeliveryListApi(params: any, mode: ErrorMessageMode = 'modal') {
  if (params.AdminID === 1) {
    delete params['AdminID'];
  }
  return defHttp.get<any>(
    {
      url: Api.AdminGetDeliveryList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminUpdateDeliveryInfoApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<any>(
    {
      url: Api.AdminUpdateDeliveryInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminDeleteDeliveryApi(params: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete<any>(
    {
      url: Api.AdminDeleteDelivery + '?' + `${params}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminCreateDeliveryApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<any>(
    {
      url: Api.AdminCreateDelivery,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
