import { AdminGetDeliveryListApi } from '@/api/admin/delivery';
import { AdminGetOrderListApi } from '@/api/admin/order';
import { AdminGetUserListApi } from '@/api/admin/user';
import { onMounted, ref } from 'vue';

export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string;
  action: string;
}

const growCardList = ref<GrowCardItem[]>([
  {
    title: '订单量',
    icon: 'visit-count|svg',
    value: 0,
    total: 0,
    color: 'green',
    action: '月',
  },
  {
    title: '成交额',
    icon: 'total-sales|svg',
    value: 0,
    total: 0,
    color: 'blue',
    action: '月',
  },
  {
    title: '用户量',
    icon: 'download-count|svg',
    value: 0,
    total: 0,
    color: 'orange',
    action: '总',
  },
  {
    title: '配送员人数',
    icon: 'transaction|svg',
    value: 0,
    total: 0,
    color: 'purple',
    action: '总',
  },
]);

const processOrderData = (orders: any[]) => {
  const totalOrders = orders.length; // 总订单数量
  let monthlyOrders = 0; // 本月订单数量
  const totalPrice = orders.reduce((total, order) => total + order.price, 0); // 总成交额
  let monthlyPrice = 0; // 本月成交额
  const currentMonth = new Date().getMonth() + 1; // 注意：getMonth() 返回的月份是 0-11，因此需要 +1

  orders.forEach((order) => {
    const orderMonth = new Date(order.createdTime).getMonth() + 1;
    if (orderMonth === currentMonth) {
      monthlyOrders++;
      monthlyPrice += order.price;
    }
  });

  return { totalOrders, monthlyOrders, totalPrice, monthlyPrice };
};

const fetchData = async () => {
  console.log('fetchData');
  const orderResponse = await AdminGetOrderListApi({
    page: 1,
    pageSize: 99999,
  });
  const { totalOrders, monthlyOrders, totalPrice, monthlyPrice } = processOrderData(
    orderResponse.rows,
  );

  const userResponse = await AdminGetUserListApi({
    page: 1,
    pageSize: 99999,
  });
  const totalUsers = userResponse.rows.length;

  const deliveryResponse = await AdminGetDeliveryListApi({
    page: 1,
    pageSize: 99999,
  });
  const totalDeliverys = deliveryResponse.rows.length;

  // 更新 growCardList 中的数据
  growCardList.value = [
    {
      title: '订单量',
      icon: 'visit-count|svg',
      value: monthlyOrders,
      total: totalOrders,
      color: 'green',
      action: '月',
    },
    {
      title: '成交额',
      icon: 'total-sales|svg',
      value: monthlyPrice,
      total: totalPrice,
      color: 'blue',
      action: '月',
    },
    {
      title: '用户量',
      icon: 'download-count|svg',
      value: totalUsers,
      total: totalUsers,
      color: 'orange',
      action: '总',
    },
    {
      title: '配送员人数',
      icon: 'transaction|svg',
      value: totalDeliverys,
      total: totalDeliverys,
      color: 'purple',
      action: '总',
    },
  ];

  console.log('growCardList', growCardList.value);
};

onMounted(() => {
  fetchData();
});

export { growCardList };
