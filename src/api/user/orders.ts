import { defHttp } from '@/utils/http/axios';
import { OrderModel } from '../model/orderModel';

import { ErrorMessageMode } from '#/axios';
import { useRequest } from '@vben/hooks';

enum Api {
  CreateOrder = '/user/createOrder',
  UpdateOrder = '/user/updateOrder',
  GetOrders = '/user/orders',
  ReviewOrder = '/user/reviewOrder',
}

/**
 * @description: create order api
 */
export function UserCreateOrderApi(params: Partial<OrderModel>, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<{ orderID: number }>(
    {
      url: Api.CreateOrder,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function UserUpdateOrderApi(params: Partial<OrderModel>, mode: ErrorMessageMode = 'modal') {
  console.log('update order api params', { params });
  return defHttp.post<null>(
    {
      url: Api.UpdateOrder,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function UserGetOrdersApi(
  params: { userID: number; orderID: number | null },
  mode: ErrorMessageMode = 'modal',
) {
  const res = defHttp.get<OrderModel[]>(
    {
      url: Api.GetOrders,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
  console.log('get orders api res', res);
  return res;
}

// 新的用于轮询的函数
export function pollingUserGetOrdersApi(
  params: { userID: number; orderID: number | null },
  mode: ErrorMessageMode = 'modal',
  pollingInterval: number = 3000,
) {
  // 封装用于轮询的异步函数
  async function fetchOrders(): Promise<OrderModel[]> {
    return UserGetOrdersApi(params, mode);
  }

  // 使用 useRequest 设置轮询
  const { data, error, loading, run, cancel } = useRequest(fetchOrders, {
    pollingInterval,
  });
  return { data, error, loading, run, cancel };
}

export function UserReviewOrderApi(
  params: { userID: number; orderID: number; rating: number; comments: string | null },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post<null>(
    {
      url: Api.ReviewOrder,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
