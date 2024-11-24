// 递归函数生成楼号选项
function generateNumbers(count: number): { label: string; value: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    label: `${i + 1}号楼`,
    value: `${i + 1}号楼`,
  }));
}

// 定义选项
export const AddressOptions = [
  {
    label: '宿舍区',
    value: '宿舍区',
    children: [
      {
        label: '宿舍楼',
        value: '宿舍楼',
        children: [
          {
            label: '新研楼A',
            value: '新研楼A',
          },
          {
            label: '新研楼B',
            value: '新研楼B',
          },
        ].concat(generateNumbers(32)),
      },
      {
        label: '快递站',
        value: '快递站',
        children: [
          {
            label: '9号楼后快递站',
            value: '9号楼后快递站',
          },
          {
            label: '17号楼后快递站',
            value: '17号楼后快递站',
          },
        ],
      },
    ],
  },
  {
    label: '文汇路',
    value: '文汇路',
    children: [
      {
        label: '妈妈驿站',
        value: '妈妈驿站',
      },
      {
        label: '星巴克外卖柜',
        value: '星巴克外卖柜',
      },
      {
        label: '淘点点外卖柜',
        value: '淘点点外卖柜',
      },
    ],
  },
];
