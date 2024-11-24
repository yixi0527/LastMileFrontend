<template>
  <Card
    :tab-list="tabListTitle"
    v-bind="$attrs"
    :active-tab-key="activeKey"
    @tab-change="onTabChange"
  >
    <p v-if="activeKey === 'tab1'">
      <orderHourTrend />
    </p>
    <p v-if="activeKey === 'tab2'">
      <OrderTrend />
    </p>
    <p v-if="activeKey === 'tab3'"> <UserTrend /> </p>
  </Card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import orderHourTrend from './orderHourTrend.vue';
  import OrderTrend from './orderTrend.vue';
  import UserTrend from './userTrend.vue';

  const activeKey = ref('tab1');

  const tabListTitle = [
    {
      key: 'tab1',
      tab: '近7天平均订单量',
    },
    {
      key: 'tab2',
      tab: '日订单量变化趋势',
    },
    {
      key: 'tab3',
      tab: '用户新增趋势',
    },
  ];

  function onTabChange(key) {
    activeKey.value = key;
  }
</script>
