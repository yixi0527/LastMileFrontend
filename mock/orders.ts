import { MockMethod } from 'vite-plugin-mock';
import { OrderApiResponse, Order } from '@/api/sys/model/orderModel';

export const demoOrders = (): OrderApiResponse => {
  const result: OrderApiResponse = { status: 1, message: 'success', data: [] };
  for (let index = 0; index < 60; index++) {
    const order: Order = {
      createdTime: new Date().toISOString().slice(0, -5),
      updatedTime: new Date().toISOString().slice(0, -5),
      status: index % 7,
      note: `Note ${index + 1}`,
      userID: 1,
      adminID: 1,
      deliveryPersonID: 1,
      itemInfo: `Item ${index + 1}`,
      orderEndTime: null,
      price: (index + 1) * 10,
      orderID: index + 1,
      orderBeginTime: null,
      pickupAddress: `Pickup Address ${index + 1}`,
      deliveryAddress: `Delivery Address ${index + 1}`,
    };
    result.data.push(order);
  }
  return result;
};

export default [
  // mock create order
  // {
  //   url: '/api/user/createOrder',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         orderID: 1,
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/orders',
  //   method: 'get',
  //   response: ({ query }) => {
  //     const userID = query.userID;
  //     const orderID = query.orderID;
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: demoOrders().data.filter(
  //         (order) =>
  //           order.userID === Number(userID) && (orderID ? order.orderID === Number(orderID) : true),
  //       ),
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/updateOrder',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: demoOrders().data,
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/reviewOrder',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: null,
  //     };
  //   },
  // },
  // {
  //   url: '/api/delivery/orders',
  //   method: 'get',
  //   response: ({ query }) => {
  //     const userID = query.deliveryID;
  //     const orderID = query.orderID;
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: demoOrders().data.filter(
  //         (order) =>
  //           order.userID === Number(userID) && (orderID ? order.orderID === Number(orderID) : true),
  //       ),
  //     };
  //   },
  // },
  // {
  //   url: '/api/delivery/myOrders',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: demoOrders().data,
  //     };
  //   },
  // },
] as MockMethod[];
