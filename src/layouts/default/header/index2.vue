<template>
  <Layout.Header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">
      <Icon
        icon="mage:megaphone-b"
        style="margin-left: 22px; font-size: 22px"
        :class="[`iconColor--${theme}`]"
      />
      <span style="margin-top: 17px; margin-left: 12px">
        <Carousel
          :autoplay="true"
          :vertical="true"
          :adaptiveHeight="true"
          :autoplaySpeed="3000"
          :dots="false"
          :infinite="true"
          :draggable="false"
        >
          <p
            v-for="(text, index) in carouselTexts"
            :key="index"
            :class="[`textColor--${theme}`, 'adaptive-text']"
          >
            {{ text }}
          </p>
        </Carousel>
      </span>
    </div>
  </Layout.Header>
</template>

<script lang="ts" setup>
  import { Layout, Carousel } from 'ant-design-vue';
  import { computed, unref, ref, provide } from 'vue';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';

  import Icon from '@/components/Icon/Icon.vue';

  const headerHeight = ref(21);
  provide('headerHeight', headerHeight);
  const updateHeaderHeight = (height) => {
    headerHeight.value = height;
  };
  provide('updateHeaderHeight', updateHeaderHeight);
  defineOptions({ name: 'LayoutHeader' });

  const props = defineProps({
    fixed: propTypes.bool,
  });
  const { prefixCls } = useDesign('layout-header');
  const { getHeaderTheme } = useHeaderSetting();
  const theme = computed(() => unref(getHeaderTheme));
  const { getIsMobile } = useAppInject();

  const getHeaderClass = computed(() => {
    const theme = unref(getHeaderTheme);
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
        [`${prefixCls}--${theme}`]: theme,
      },
    ];
  });

  // Define the texts for the carousel
  const carouselTexts = [
    '欢迎来到DHU最后一公里 试运营期间优惠配送！',
    '我们致力于为您提供更便捷的校园生活服务！',
    '品质保障，服务一流！',
  ];
</script>

<style lang="less">
  @import url('./index.less');

  /* For smaller screens (e.g., mobile phones), reduce font size further */
  @media (max-width: 480px) {
    .adaptive-text {
      font-size: calc(10px + 0.5vw);
    }
  }

  .iconColor {
    &--dark {
      color: rgb(219 213 213);
    }

    &--light {
      color: black;
    }
  }

  .textColor {
    &--dark {
      color: rgb(219 213 213);
    }

    &--light {
      color: black;
    }
  }

  :deep(.slick-slide) {
    height: 160px;
    overflow: hidden;
    background: #364d79;
    line-height: 160px;
    text-align: center;
  }

  :deep(.slick-slide h3) {
    color: #fff;
  }

  /* Custom adaptive text class */
  .adaptive-text {
    display: inline-block; /* Allow text to shrink within its container */
    width: 80%; /* Ensure the text takes up full width of its container */
    overflow: hidden; /* Prevent text overflow */
    font-size: calc(12px + 0.5vw); /* Dynamically adjust font size based on viewport width */
    text-align: left; /* Center the text */
    text-overflow: ellipsis; /* Optionally use ellipsis if needed, but not required for full display */
    white-space: nowrap; /* Ensure text stays on a single line */
  }
</style>
