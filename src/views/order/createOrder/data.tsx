/*
预约及加急服务后续上线
*/
import { FormSchema } from '@/components/Form';
import { getUserID } from '@/utils/auth';
import { getUserInfo } from '@/api/user/self';
import { ref } from 'vue';
import { uploadApi } from '@/api/sys/upload';
import myImageUpload from '@/components/Upload/src/components/myImageUpload.vue';
import { useComponentRegister } from '@/components/Form/index';
import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { AxiosProgressEvent } from 'axios';
import { AddressOptions } from '@/constants/locationOptions';

useComponentRegister('MyImageUpload', myImageUpload);

interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
}

const generateNumbers = (maxNumber: number): CascaderOption[] => {
  const numbers: CascaderOption[] = [];
  for (let i = 1; i <= maxNumber; i++) {
    numbers.push({
      label: `${i}` + '号楼',
      value: `${i}`,
    });
  }
  return numbers;
};

const fakeuploadApi = (
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) => {
  return new Promise<UploadApiResult>((resolve) => {
    resolve({ data: 'this is fake data' });
  });
};

const userInfo = await getUserInfo({ userID: getUserID() });
const phonenumber = userInfo.phoneNumber;
const defaultAddress = userInfo.defaultDeliveryAddress
  ? userInfo.defaultDeliveryAddress.split('/')
  : ['宿舍区', '宿舍楼', '新研楼A'];
const showBook = ref(false);
const showRush = ref(false);

export const step1Schemas: FormSchema[] = [
  {
    field: 'pickupAddress',
    component: 'Cascader',
    label: '取货地点',
    required: true,
    defaultValue: ['宿舍区', '宿舍楼', '新研楼A'],
    componentProps: {
      options: AddressOptions,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'deliveryAddress',
    component: 'Cascader',
    label: '收货地点',
    required: true,
    defaultValue: defaultAddress,
    componentProps: {
      options: AddressOptions,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '联系电话',
    defaultValue: phonenumber,
    required: true,
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        message: '请输入联系电话',
      },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: '请输入正确的手机号码',
      },
    ],
  },
  {
    field: 'itemInfo',
    component: 'InputTextArea',
    label: '物品信息',
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '物品信息是你需要我们帮你取/送的物品描述',
    },
  },
  {
    field: 'pickupCode',
    component: 'Input',
    label: '取件码/取餐码',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '如有，非必填',
    },
  },
  {
    field: 'note',
    component: 'Input',
    label: '备注',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '如有，非必填',
    },
  },
  {
    field: 'hurry',
    component: 'Checkbox',
    label: '加急',
    componentProps: {
      // 'onUpdate:checked': (val: boolean) => {
      //   showBook.value = val;
      // },
    },
    show: false,
  },

  {
    field: 'book',
    component: 'Checkbox',
    label: '预约',
    componentProps: {
      // 'onUpdate:checked': (val: boolean) => {
      //   showBook.value = val;
      // },
    },
    show: false,
  },
  {
    field: 'other',
    component: 'Checkbox',
    label: '其他',
    componentProps: {},
    show: false,
  },
  {
    field: 'expectTime',
    component: 'Input',
    label: '期望送达时间',
    colProps: {
      span: 24,
    },
    componentProps: {
      addonAfter: '分钟内',
    },
    show: showRush.value,
  },
  {
    field: 'expectTime',
    component: 'Input',
    label: '期望送达时间',
    colProps: {
      span: 24,
    },
    componentProps: {
      addonAfter: '分钟内',
    },
    show: showBook.value,
  },
];

export const step2Schemas: FormSchema[] = [
  // {
  //   field: 'pay',
  //   component: 'showImg',
  //   label: '支付密码',
  //   required: true,
  //   defaultValue: '123456',
  //   colProps: {
  //     span: 24,
  //   },
  // },
];
