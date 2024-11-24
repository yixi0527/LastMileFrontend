import { defHttp } from '@/utils/http/axios';
import { OrderModel } from '../model/orderModel';

import { ErrorMessageMode } from '#/axios';
import { func } from 'vue-types';

enum Api {
  GetAvailableOrders = '/delivery/orders',
  UpdateOrder = '/delivery/updateOrder',
  GetMyOrders = '/delivery/myOrders',
}

export function DeliveryGetAvailableOrdersApi(params, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<OrderModel[]>(
    {
      url: Api.GetAvailableOrders,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function DeliveryUpdateOrderApi(params, mode: ErrorMessageMode = 'modal') {
  console.log(params);
  return defHttp.post(
    {
      url: Api.UpdateOrder,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function DeliveryGetMyOrdersApi(params, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<OrderModel[]>(
    {
      url: Api.GetMyOrders,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
