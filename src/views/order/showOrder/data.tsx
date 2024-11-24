import { FormSchema } from '@/components/Form';
import { getStatusText } from '@/utils/getStatusText';

export const actions: any[] = [
  { icon: 'emojione:cityscape', text: '取自', color: '#000' },
  { icon: 'emojione:automobile', text: '送往', color: '#459ae8' },
  { icon: 'emojione:backhand-index-pointing-right', text: '订单状态', color: '#42d27d' },
  { icon: 'twemoji:money-bag', text: '订单金额', color: '#42d27d' },
  { icon: 'twemoji:two-oclock', text: '下单于', color: '#42d27d' },
];
export const schemas: FormSchema[] = [
  {
    field: 'search',
    component: 'InputSearch',
    label: '关键词',
    colProps: {
      span: 24, // 占据整行
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'status',
    component: 'RadioButtonGroup',
    label: '',
    defaultValue: -1,
    colProps: {
      span: 24, // 占据整行
    },
    componentProps: {
      options: [
        {
          label: '待付款',
          value: 1,
        },
        {
          label: '待取货',
          value: 3,
        },
        {
          label: '送货中',
          value: 4,
        },
      ],
    },
  },
  {
    field: 'status',
    component: 'RadioButtonGroup',
    label: '',
    defaultValue: -1,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: '已送达',
          value: 5,
        },
        {
          label: '待评价',
          value: 6,
        },
        {
          label: '已完成',
          value: 7,
        },
      ],
    },
  },
];
