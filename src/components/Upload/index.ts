import { withInstall } from '@/utils';
import basicUpload from './src/BasicUpload.vue';
import uploadImage from './src/components/ImageUpload.vue';
import myuploadImage from './src/components/myImageUpload.vue';

export const ImageUpload = withInstall(uploadImage);
export const BasicUpload = withInstall(basicUpload);
export const myBasicUpload = withInstall(myuploadImage);
