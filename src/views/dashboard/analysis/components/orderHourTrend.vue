<template>
  <div>
    <select v-model="timePrecision" @change="updateChart">
      <option value="15min">每15分钟</option>
      <option value="30min">每30分钟</option>
      <option value="hour">每小时</option>
      <option value="3hour">每三小时</option>
    </select>
    <div ref="chartRef" :style="{ height, width }"></div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { AdminGetOrderListApi } from '@/api/admin/order';

  defineProps({
    ...basicProps,
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const timePrecision = ref('hour'); // 默认选择每小时

  // 过滤最近7天的订单
  const filterRecent7DaysOrders = (orders: any[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return orders.filter((order) => new Date(order.createdTime) >= sevenDaysAgo);
  };

  // 计算平均订单量
  const calculateAverage = (orders: any[], timeSegmentCount: number, segmentDuration: number) => {
    const segmentCounts: number[] = new Array(timeSegmentCount).fill(0);
    const daysCount = 7;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdTime);
      const segmentIndex = Math.floor(
        (orderDate.getHours() * 60 + orderDate.getMinutes()) / segmentDuration,
      );
      segmentCounts[segmentIndex]++;
    });

    return segmentCounts.map((count) => count / daysCount);
  };

  const updateChart = async () => {
    const response = await AdminGetOrderListApi({
      page: 1,
      pageSize: 99999,
    });

    const orders = filterRecent7DaysOrders(response.rows);
    let processedData: number[] = [];
    let xAxisData: string[] = [];

    if (timePrecision.value === '15min') {
      processedData = calculateAverage(orders, 96, 15); // 96个15分钟段
      xAxisData = [...new Array(96)].map((_, index) => {
        const hour = Math.floor(index / 4);
        const minute = (index % 4) * 15;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      });
    } else if (timePrecision.value === '30min') {
      processedData = calculateAverage(orders, 48, 30); // 48个30分钟段
      xAxisData = [...new Array(48)].map((_, index) => {
        const hour = Math.floor(index / 2);
        const minute = (index % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      });
    } else if (timePrecision.value === 'hour') {
      processedData = calculateAverage(orders, 24, 60); // 24个小时段
      xAxisData = [...new Array(24)].map((_, index) => `${index.toString().padStart(2, '0')}:00`);
    } else if (timePrecision.value === '3hour') {
      processedData = calculateAverage(orders, 8, 180); // 8个三小时段
      xAxisData = [...new Array(8)].map((_, index) => {
        const startHour = index * 3;
        const endHour = startHour + 3;
        return `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
      });
    }

    setOptions({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            width: 1,
            color: '#019680',
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        splitLine: {
          show: true,
          lineStyle: {
            width: 1,
            type: 'solid',
            color: 'rgba(226,226,226,0.5)',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          splitNumber: 4,
          axisTick: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
            },
          },
        },
      ],
      grid: {
        left: '1%',
        right: '1%',
        top: '2%',
        bottom: '10%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          bottom: 0,
        },
      ],
      series: [
        {
          smooth: true,
          data: processedData,
          type: 'line',
          areaStyle: {},
          itemStyle: {
            color: '#5ab1ef',
          },
        },
      ],
    });
  };

  onMounted(updateChart);
</script>
