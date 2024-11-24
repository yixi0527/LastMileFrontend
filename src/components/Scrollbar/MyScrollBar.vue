<template>
  <div class="scroll-bar" @click="togglePause">
    <div
      class="scroll-content"
      :style="{
        animationDuration: duration + 's',
        animationPlayState: isPaused ? 'paused' : 'running',
      }"
    >
      <span v-for="(text, index) in texts" :key="index" class="scroll-text">{{ text }}</span>
    </div>
    <link-button @click="closeScrollBar" class="control-btn">X</link-button>
  </div>
  <divider />
</template>

<script setup>
  import { ref, watch, inject } from 'vue';
  import { Button, Divider } from 'ant-design-vue';
  // 滚动的文本列表
  const texts = ref([
    '欢迎来到DHU最后一公里',
    '试运营期间免费配送！',
    '客服联系方式：13516483448（微信同号）',
  ]);

  // 设置滚动的持续时间（秒）
  const duration = ref(15); // 可调整速度

  // 控制是否暂停滚动
  const isPaused = ref(false);

  // 轮次间隔时间（秒）
  const interval = ref(0); // 可以调整轮次之间的间隔时间

  // 滚动条元素
  const scrollContent = ref(null);

  // 暂停/继续滚动
  const togglePause = () => {
    isPaused.value = !isPaused.value;
  };
  const isScrollBarClosed = ref(false);
  const updateHeaderHeight = inject('updateHeaderHeight');
  // 关闭滚动条
  const closeScrollBar = () => {
    if (updateHeaderHeight) {
      updateHeaderHeight(0);
    }
    isScrollBarClosed.value = true;
    document.querySelector('.scroll-bar').style.display = 'none';
  };

  // 添加间隔时间的函数
  const addInterval = () => {
    if (scrollContent.value) {
      const scrollWidth = scrollContent.value.scrollWidth;
      const viewportWidth = scrollContent.value.clientWidth;
      const scrollDuration = duration.value;
      const intervalDuration = interval.value;

      const totalDuration =
        (scrollWidth + viewportWidth) / (viewportWidth / scrollDuration) + intervalDuration;

      scrollContent.value.style.animation = `scroll-left ${scrollDuration}s linear infinite`;

      setTimeout(() => {
        scrollContent.value.style.animationPlayState = 'paused';
        setTimeout(() => {
          scrollContent.value.style.animationPlayState = 'running';
        }, intervalDuration * 1000);
      }, totalDuration * 1000);
    }
  };

  // 监视 duration 和 interval 的变化
  watch([duration, interval], addInterval, { immediate: true });
</script>

<style scoped>
  .scroll-bar {
    display: flex;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    padding: 0 60px 0 20px; /* 调整右侧填充留出按钮空间 */
    overflow: hidden;
    background-color: #fff;
    color: #000;
    font-size: 18px;
    white-space: nowrap;
  }

  .scroll-content {
    display: flex;
    padding-left: 100%;
    animation: scroll-left linear infinite;
  }

  .scroll-text {
    padding-right: 100px;
  }

  @keyframes scroll-left {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(-100%);
    }
  }

  .control-btn {
    position: absolute;
    top: 0;
    right: 0;

    /* padding: 5px 10px; */
    transition:
      background-color 0.3s,
      color 0.3s;
    border: none;
    border-radius: 4px;
    background-color: #fff;
    color: #000;
    font-size: 18px;
    cursor: pointer;
  }
</style>
