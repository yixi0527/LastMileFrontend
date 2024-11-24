<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        :title="item.title"
        class="md:w-1/4 w-full !md:mt-0"
        :class="{ '!md:mr-4': index + 1 < 4, '!mt-4': index > 0 }"
      >
        <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo :prefix="item.prefix" :startVal="1" :endVal="item.value" class="text-2xl" />
          <Icon :icon="item.icon" :size="40" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span v-if="index === 0"> 总订单量 </span>
          <span v-if="index === 1"> 总成交额 </span>
          <span v-if="index === 2"> 总用户量 </span>
          <span v-if="index === 3"> 总配送员人数 </span>
          <CountTo :prefix="item.prefix" :startVal="1" :endVal="item.total" />
        </div>
      </Card>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { CountTo } from '@/components/CountTo';
  import Icon from '@/components/Icon/Icon.vue';
  import { Tag, Card } from 'ant-design-vue';
  import { AdminGetDeliveryListApi } from '@/api/admin/delivery';
  import { AdminGetOrderListApi } from '@/api/admin/order';
  import { AdminGetUserListApi } from '@/api/admin/user';

  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const growCardList = ref([
    {
      title: '订单量',
      icon: 'fluent-emoji:card-file-box',
      value: 0,
      total: 0,
      color: 'green',
      action: '月',
    },
    {
      title: '成交额',
      icon: 'twemoji:money-bag',
      value: 0,
      total: 0,
      color: 'blue',
      action: '月',
      prefix: '￥',
    },
    {
      title: '新增用户量',
      icon: 'emojione:man-and-woman-holding-hands',
      value: 0,
      total: 0,
      color: 'orange',
      action: '周',
    },
    {
      title: '新增配送员人数',
      icon: 'emojione:horse-racing',
      value: 0,
      total: 0,
      color: 'purple',
      action: '周',
    },
  ]);

  const processOrderData = (orders: any[]) => {
    const totalOrders = orders.length;
    let recentMonthOrders = 0;
    const totalPrice = orders.reduce((total, order) => total + order.price, 0);
    let recentMonthPrice = 0;

    // 获取当前日期，并计算一个月前的日期
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    orders.forEach((order) => {
      const orderDate = new Date(order.createdTime);
      // 判断订单日期是否在最近一个月内
      if (orderDate >= oneMonthAgo && orderDate <= currentDate) {
        recentMonthOrders++;
        recentMonthPrice += order.price;
      }
    });

    growCardList.value[0].value = recentMonthOrders;
    growCardList.value[0].total = totalOrders;
    growCardList.value[1].value = recentMonthPrice;
    growCardList.value[1].total = totalPrice;
  };

  const getRecentCount = (items: any[], field: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return items.filter((item) => new Date(item[field]) >= oneWeekAgo).length;
  };

  const fetchData = async () => {
    const { rows: orders } = await AdminGetOrderListApi({ page: 1, pageSize: 99999 });
    const { rows: users } = await AdminGetUserListApi({ page: 1, pageSize: 99999 });
    const { rows: deliverys } = await AdminGetDeliveryListApi({ page: 1, pageSize: 99999 });

    growCardList.value[2].value = getRecentCount(users, 'createdTime');
    growCardList.value[2].total = users.length;
    growCardList.value[3].value = getRecentCount(deliverys, 'createdTime');
    growCardList.value[3].total = deliverys.length;

    processOrderData(orders);
  };

  onMounted(() => {
    fetchData();
  });
</script>
