import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';
import { ResultEnum } from '../../src/enums/httpEnum';

const userInfo = {
  status: 1,
  message: 'Success',
  data: {
    userID: 1,
    adminID: 0,
    username: 'user1',
    defaultDeliveryAddress: 'Address 1',
    phoneNumber: '12345678901',
    email: 'user1@example.com',
    createdTime: '2024-07-09T21:34:51',
    updatedTime: '2024-07-09T21:34:51',
  },
};

export default [
  {
    url: '/api/account/getAccountInfo',
    timeout: 1000,
    method: 'get',
    response: () => {
      return userInfo;
    },
  },
  {
    url: '/api/user/sessionTimeout',
    method: 'post',
    statusCode: 401,
    response: () => {
      return resultError();
    },
  },
  {
    url: '/api/user/tokenExpired',
    method: 'post',
    statusCode: 200,
    response: () => {
      return resultError('Token Expired!', { code: ResultEnum.TIMEOUT as number });
    },
  },
] as MockMethod[];
