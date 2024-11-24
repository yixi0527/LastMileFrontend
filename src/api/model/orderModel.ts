export interface OrderModel {
  orderID: number;
  userID: number;
  deliveryPersonID: number;
  adminID: number;

  status: number;
  itemInfo: string;
  note: string;
  price: number;
  phoneNumber: string;
  pickupCode: string;

  orderBeginTime: null | string;
  createdTime: string;
  updatedTime: string;
  orderEndTime: null | string;

  pickupAddress: string;
  deliveryAddress: string;
  book: boolean | null;
  bookTime: null | string;
  rush: boolean | null;
  rushTime: null | string;
  itemImage: File[] | null;
}
