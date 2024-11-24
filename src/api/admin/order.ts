import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  AdminGetOrderList = '/admin/getOrderList',
  AdminUpdateOrderInfo = '/admin/updateOrder',
  AdminDeleteOrder = '/admin/deleteOrdersByIds',
  AdminCreateOrder = '/admin/createOrder',
}

export function AdminGetOrderListApi(params: any, mode: ErrorMessageMode = 'modal') {
  if (params.AdminID === 1) {
    delete params['AdminID'];
  }
  const ret = defHttp.get<any>(
    {
      url: Api.AdminGetOrderList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  return ret;
}

export function AdminUpdateOrderInfoApi(params: any, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<any>(
    {
      url: Api.AdminUpdateOrderInfo,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminDeleteOrderApi(params: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.delete<any>(
    {
      url: Api.AdminDeleteOrder + '?' + `${params}`,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function AdminCreateOrderApi(params: any, mode: ErrorMessageMode = 'modal') {
  params['deliveryAddress'] = params['deliveryAddress'].join('/');
  params['pickupAddress'] = params['pickupAddress'].join('/');
  return defHttp.post<any>(
    {
      url: Api.AdminCreateOrder,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
