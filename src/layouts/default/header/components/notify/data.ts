export interface ListItem {
  id: string | number;
  avatar: string;
  // 通知的标题内容
  title: string;
  // 是否在标题上显示删除线
  titleDelete?: boolean;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra?: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  unreadlist?: ListItem[];
}

export const tabListData: TabItem[] = [
  {
    key: '1',
    name: '通知',
    list: [
      {
        id: '000000001',
        avatar: 'flowbite:badge-check-outline',
        title: '你收到了 14 份新周报',
        description: '',
        datetime: '2017-08-09',
        type: '1',
      },
    ],
  },
];
