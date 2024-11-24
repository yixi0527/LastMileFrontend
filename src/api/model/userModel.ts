import { RoleEnum } from '@/enums/roleEnum';
/**
 * @description: userLogin interface return value
 */
export interface UserLoginResultModel {
  userID: number;
  username: string;
  token: string;
}

/**
 * @description: Get user information return value
 */
export interface UserInfoModel {
  userID: number;
  adminID: number;
  adminName?: string;
  username: string;
  defaultDeliveryAddress: string | null;
  phoneNumber: string;
  createdTime: string;
  updatedTime: string;
  roles: RoleEnum.USER;
  /*email暂未使用*/
  email: string | null;
  homePath?: string;
}

export interface UserRegisterModel {
  username: string;
  password: string;
  phoneNumber: string;
  defaultDeliveryAddress: string | null;
  /*email暂未使用*/
  email: string | null;
}
