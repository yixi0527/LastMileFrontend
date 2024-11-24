import { FormSchema } from '@/components/Form/index';
import { AddressOptions } from '@/constants/locationOptions';
// 平台管理员表单配置
export const adminFormSchema: FormSchema[] = [
  {
    field: 'adminName',
    component: 'Input',
    label: '管理员名称',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入管理员名称',
      },
    ],
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
];

// 用户表单配置
export const userFormSchema: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '手机号',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入手机号',
      },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: '手机号格式错误',
      },
    ],
  },
  {
    field: 'defaultDeliveryAddress',
    component: 'Cascader',
    label: '默认配送地址',
    required: false,
    colProps: { span: 24 },
    componentProps: {
      options: AddressOptions,
    },
  },
];

// 配送员表单配置
export const deliveryFormSchema: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'password',
    component: 'InputPassword',
    label: '密码',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '手机号',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入手机号',
      },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: '手机号格式错误',
      },
    ],
  },
];

// 订单表单配置
export const orderFormSchema: FormSchema[] = [
  {
    field: 'userID',
    component: 'Input',
    label: '用户ID',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'pickupAddress',
    component: 'Cascader',
    label: '取货地址',
    required: true,
    colProps: { span: 24 },
    componentProps: {
      options: AddressOptions,
    },
  },
  {
    field: 'deliveryAddress',
    component: 'Cascader',
    label: '收货地址',
    required: true,
    colProps: { span: 24 },
    componentProps: {
      options: AddressOptions,
    },
  },
  {
    field: 'itemInfo',
    component: 'InputTextArea',
    label: '物品信息',
    required: true,
    colProps: { span: 24 },
  },
  {
    field: 'price',
    component: 'InputNumber',
    label: '价格',
    required: false,
    colProps: { span: 24 },
  },
  {
    field: 'deliveryPersonID',
    component: 'Input',
    label: '配送员ID',
    required: false,
    colProps: { span: 24 },
  },
  {
    field: 'note',
    component: 'Input',
    label: '备注',
    required: false,
    colProps: { span: 24 },
  },
  {
    field: 'phoneNumber',
    component: 'Input',
    label: '联系电话',
    required: true,
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        message: '请输入联系电话',
      },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: '联系电话格式错误',
      },
    ],
  },
];
