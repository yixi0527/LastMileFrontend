import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createFakeUserList() {
  return [
    {
      username: 'user1',
      password: 'userpassword1',
    },
    {
      username: 'user2',
      password: 'userpassword2',
    },
  ];
}

// const fakeCodeList: any = {
//   '1': ['1000', '3000', '5000'],

//   '2': ['2000', '4000', '6000'],
// };
export default [
  // {
  //   url: '/api/user/login',
  //   timeout: 200,
  //   method: 'post',
  //   response: () => {
  //     const res = {
  //       status: 1,
  //       message: '登录成功',
  //       data: {
  //         userID: 1,
  //         username: 'user1',
  //         token: 'user1-token',
  //       },
  //     };
  //     return res;
  //   },
  // },
  // {
  //   url: '/api/delivery/login',
  //   timeout: 200,
  //   method: 'post',
  //   response: () => {
  //     const res = {
  //       status: 1,
  //       data: {
  //         userId: '1',
  //         username: 'delivery1',
  //         token: 'delivery-token',
  //       },
  //     };
  //     return res;
  //   },
  // },
  // {
  //   url: '/api/user/profile',
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         userID: 1,
  //         adminID: 0,
  //         username: 'Aming',
  //         defaultDeliveryAddress: '123/456/789',
  //         phoneNumber: '12345678901',
  //         email: 'user1@example.com',
  //         createdTime: '2024-07-09T21:34:51',
  //         updatedTime: '2024-07-09T21:34:51',
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/delivery/profile',
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const ret = {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         deliveryPersonID: 1,
  //         username: 'delivery1',
  //         phoneNumber: '12345678901',
  //         contactInfo: 'Contact Info 1',
  //         createdTime: '2024-07-09T21:34:53',
  //         updatedTime: '2024-07-09T21:34:53',
  //         adminID: 1,
  //         status: 1,
  //       },
  //     };
  //     console.log('delivery profile', ret);
  //     return ret;
  //   },
  // },
  // {
  //   url: '/api/getPermCode',
  //   timeout: 200,
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const checkUser = createFakeUserList().find((item) => item.token === token);
  //     if (!checkUser) {
  //       return resultError('Invalid token!');
  //     }
  //     const codeList = fakeCodeList[checkUser.userId];
  //     return codeList;
  //   },
  // },
  {
    url: '/api/logout',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(undefined, { message: 'Token has been destroyed' });
    },
  },
  // {
  //   url: '/api/user/update',
  //   timeout: 200,
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
  //   url: '/api/delivery/update',
  //   timeout: 200,
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
  //   url: '/api/testRetry',
  //   statusCode: 405,
  //   method: 'get',
  //   response: () => {
  //     return resultError('Error!');
  //   },
  // },
  // {
  //   url: '/api/delivery/updateOrder',
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
  //   url: '/api/user/register',
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
  //   url: '/api/delivery/register',
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
  //   url: '/api/admin/login',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         adminID: 1,
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/profile',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         userID: 1,
  //         adminID: 0,
  //         username: 'Aming',
  //         defaultDeliveryAddress: '123/456/789',
  //         phoneNumber: '12345678901',
  //         email: 'user1@example.com',
  //         createdTime: '2024-07-09T21:34:51',
  //         updatedTime: '2024-07-09T21:34:51',
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/updateUserById',
  //   method: 'put',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: null,
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/getUserList',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         total: 6,
  //         rows: [
  //           {
  //             createdTime: '2024-08-12T10:11:10',
  //             updatedTime: '2024-08-13T11:46:36',
  //             password: '',
  //             phoneNumber: '12345678901',
  //             userID: 1,
  //             adminID: 2,
  //             username: 'user1',
  //             email: 'user1@example.com',
  //             defaultDeliveryAddress: 'Address 1',
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678902',
  //             userID: 2,
  //             adminID: 2,
  //             username: 'user2',
  //             email: 'user2@example.com',
  //             defaultDeliveryAddress: 'Address 2',
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678903',
  //             userID: 3,
  //             adminID: 2,
  //             username: 'user3',
  //             email: 'user3@example.com',
  //             defaultDeliveryAddress: 'Address 3',
  //           },
  //           {
  //             createdTime: '2024-08-15T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678904',
  //             userID: 4,
  //             adminID: 1,
  //             username: 'user4',
  //             email: 'user4@example.com',
  //             defaultDeliveryAddress: 'Address 4',
  //           },
  //           {
  //             createdTime: '2024-08-15T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678905',
  //             userID: 5,
  //             adminID: 1,
  //             username: 'user5',
  //             email: 'user5@example.com',
  //             defaultDeliveryAddress: 'Address 5',
  //           },
  //           {
  //             createdTime: '2024-08-11T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678906',
  //             userID: 6,
  //             adminID: 1,
  //             username: 'user6',
  //             email: 'user6@example.com',
  //             defaultDeliveryAddress: 'Address 6',
  //           },
  //         ],
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/getDyPersonList',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         total: 6,
  //         rows: [
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T11:46:36',
  //             password: '',
  //             phoneNumber: '12345678901',
  //             deliveryPersonID: 1,
  //             adminID: 2,
  //             username: 'user1',
  //             email: 'user1@example.com',
  //             status: 2,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678902',
  //             deliveryPersonID: 2,
  //             adminID: 2,
  //             username: 'user2',
  //             email: 'user2@example.com',
  //             status: 0,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678903',
  //             deliveryPersonID: 3,
  //             adminID: 2,
  //             username: 'user3',
  //             email: 'user3@example.com',
  //             status: 1,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678904',
  //             deliveryPersonID: 4,
  //             adminID: 1,
  //             username: 'user4',
  //             email: 'user4@example.com',
  //             status: 0,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678905',
  //             deliveryPersonID: 5,
  //             adminID: 1,
  //             username: 'user5',
  //             email: 'user5@example.com',
  //             status: 2,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678906',
  //             deliveryPersonID: 6,
  //             adminID: 1,
  //             username: 'user6',
  //             email: 'user6@example.com',
  //             status: 1,
  //           },
  //         ],
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/getOrderList',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         total: 10,
  //         rows: [
  //           {
  //             createdTime: '2024-08-14T16:00:32',
  //             updatedTime: '2024-08-14T23:26:39',
  //             status: 3,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 1,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 2,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //           {
  //             createdTime: '2024-08-13T14:58:32',
  //             updatedTime: '2024-08-14T23:26:39',
  //             status: 3,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 2,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 2,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //           {
  //             createdTime: '2024-08-12T12:58:32',
  //             updatedTime: '2024-08-14T23:26:39',
  //             status: 3,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 3,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 2,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //           {
  //             createdTime: '2024-08-13T16:58:32',
  //             updatedTime: '2024-08-13T17:58:32',
  //             status: 0,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 4,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 1,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //           {
  //             createdTime: '2024-08-13T05:58:32',
  //             updatedTime: '2024-08-13T17:58:32',
  //             status: 0,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 5,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 1,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //           {
  //             createdTime: '2024-08-19T08:58:32',
  //             updatedTime: '2024-08-13T17:58:32',
  //             status: 0,
  //             deliveryPersonID: 1,
  //             note: null,
  //             orderID: 6,
  //             salary: 0.0,
  //             userID: 1,
  //             adminID: 1,
  //             price: 10.0,
  //             deliveryAddress: 'Delivery Address 1',
  //             pickupAddress: 'Pickup Address 1',
  //             itemInfo: 'Item 1',
  //             bookTime: null,
  //             orderBeginTime: null,
  //             orderEndTime: null,
  //             book: false,
  //             rush: false,
  //           },
  //         ],
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/admin/getPlatformAdminList',
  //   method: 'get',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: 'Success',
  //       data: {
  //         total: 6,
  //         rows: [
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T11:46:36',
  //             password: '',
  //             phoneNumber: '12345678901',
  //             deliveryPersonID: 1,
  //             adminID: 2,
  //             username: 'user1',
  //             email: 'user1@example.com',
  //             status: 2,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678902',
  //             deliveryPersonID: 2,
  //             adminID: 2,
  //             username: 'user2',
  //             email: 'user2@example.com',
  //             status: 0,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-14T23:24:06',
  //             password: '',
  //             phoneNumber: '12345678903',
  //             deliveryPersonID: 3,
  //             adminID: 2,
  //             username: 'user3',
  //             email: 'user3@example.com',
  //             status: 1,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678904',
  //             deliveryPersonID: 4,
  //             adminID: 1,
  //             username: 'user4',
  //             email: 'user4@example.com',
  //             status: 0,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678905',
  //             deliveryPersonID: 5,
  //             adminID: 1,
  //             username: 'user5',
  //             email: 'user5@example.com',
  //             status: 2,
  //           },
  //           {
  //             createdTime: '2024-08-13T10:11:10',
  //             updatedTime: '2024-08-13T10:11:10',
  //             password: '',
  //             phoneNumber: '12345678906',
  //             deliveryPersonID: 6,
  //             adminID: 1,
  //             username: 'user6',
  //             email: 'user6@example.com',
  //             status: 1,
  //           },
  //         ],
  //       },
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/smsLogin',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 2,
  //       message: '用户不存在',
  //       data: null,
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/completeInfo',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: '',
  //       data: null,
  //     };
  //   },
  // },
  // {
  //   url: '/api/user/resetPassword',
  //   method: 'post',
  //   response: () => {
  //     return {
  //       status: 1,
  //       message: '',
  //       data: null,
  //     };
  //   },
  // },
] as MockMethod[];
