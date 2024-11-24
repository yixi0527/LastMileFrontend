import { AddressOptions } from '@/constants/locationOptions';

export const GetLocationsApi = () => {
  return { list: AddressOptions as Recordable[] };
};
