import { FormSchema } from '@/components/Form';
import { getStatusText } from '@/utils/getStatusText';

export const actions: any[] = [
  { icon: 'emojione:cityscape', text: '取自', color: '#018ffb' },
  { icon: 'emojione:automobile', text: '送往', color: '#459ae8' },
  { icon: 'emojione:backhand-index-pointing-right', text: '订单状态', color: '#42d27d' },
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
    label: '订单状态筛选',
    defaultValue: -1,
    colProps: {
      span: 24, // 占据整行
    },
    componentProps: {
      options: [
        {
          label: '待取货',
          value: 3,
        },
        {
          label: '待送货',
          value: 4,
        },
      ],
    },
  },
];
