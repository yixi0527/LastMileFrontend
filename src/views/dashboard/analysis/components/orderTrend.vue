<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { basicProps } from './props';
  import { AdminGetOrderListApi } from '@/api/admin/order';
  import dayjs from 'dayjs';

  defineProps({
    ...basicProps,
  });
  const generateDateRange = (start: string, end: string) => {
    const dates = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  };
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const processData = (orders: any[]) => {
    const dateCount: Record<string, number> = {};

    if (orders.length === 0) {
      return { dates: [], counts: [] };
    }

    // 获取用户数据中的最早日期
    const earliestDate = orders.reduce((minDate, order) => {
      const orderDate = order.createdTime.split('T')[0]; // 获取订单的日期部分
      return orderDate < minDate ? orderDate : minDate;
    }, dayjs().format('YYYY-MM-DD')); // 初始为今天的日期

    // 获取时间范围的所有日期，并初始化计数为 0
    const allDates = generateDateRange(earliestDate, dayjs().format('YYYY-MM-DD'));
    allDates.forEach((date) => {
      dateCount[date] = 0;
    });

    // 统计订单日期
    orders.forEach((order) => {
      const date = order.createdTime.split('T')[0]; // 获取订单的日期部分
      if (dateCount[date] !== undefined) {
        dateCount[date]++;
      }
    });

    const dates = Object.keys(dateCount).sort(); // 获取所有日期并排序
    const counts = dates.map((date) => dateCount[date]); // 对应日期的订单数量

    return { dates, counts };
  };

  onMounted(async () => {
    const response = await AdminGetOrderListApi({
      page: 1,
      pageSize: 99999, // 获取所有订单数据
    });

    const orders = response.rows;

    // 处理订单数据
    const { dates, counts } = processData(orders);

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
        data: dates, // 横坐标是日期
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
          min: 0, // 设置y轴的最小值为0
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
        bottom: '15%', // 增加图表主体的底部边距
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100,
          bottom: '5%', // 将 dataZoom 向下移动
        },
        {
          type: 'inside',
          start: 70, // 允许通过鼠标或触屏拖动缩放
          end: 100,
        },
      ],
      series: [
        {
          smooth: true,
          data: counts, // 每天的订单数量
          type: 'line',
          areaStyle: {},
          itemStyle: {
            color: '#5ab1ef',
          },
        },
      ],
    });
  });
</script>
