import { FormSchema } from '@/components/Form';
import { getStatusText } from '@/utils/getStatusText';

export const actions: any[] = [
  { icon: 'emojione:cityscape', text: '取自', color: '#018ffb' },
  { icon: 'emojione:automobile', text: '送往', color: '#459ae8' },
  { icon: 'emojione:backhand-index-pointing-right', text: '订单状态', color: '#42d27d' },
  { icon: 'twemoji:money-bag', text: '订单金额', color: '#42d27d' },
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
];
