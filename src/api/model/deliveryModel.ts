import { RoleEnum } from '@/enums/roleEnum';
/**
 * @description: userLogin interface return value
 */
export interface DeliveryPersonLoginResultModel {
  deliveryPersonID: number;
  username: string;
  token: string;
}

/**
 * @description: Get user information return value
 */
export interface DeliveryPersonInfoModel {
  deliveryPersonID: number;
  adminID: number;
  username: string;
  contactInfo?: string;
  phoneNumber: string;
  createdTime: string;
  updatedTime: string;
  roles: RoleEnum.DeliveryPerson;
  status: number;
  homePath?: string;
}

export interface DeliveryPersonRegisterModel {
  username: string;
  password: string;
  phoneNumber: string;
  contactInfo: string;
  /*email暂未使用*/
  email: string | null;
}
