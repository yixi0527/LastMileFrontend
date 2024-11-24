<template>
  <a-modal
    :open="visible"
    @cancel="handleCancel"
    :title="modalTitle"
    :okText="okButtonText"
    :cancelText="cancelButtonText"
    @ok="handleOk"
    :footer="props.showAction ? undefined : null"
  >
    <div class="modal-text">
      <p>
        请保存图片后扫一扫支付
        <span style="color: red">{{ formattedPrice }}</span>
        元，
        <br />
        收到付款后自动更新订单状态并立即安排派送。<br />
        系统需要1分钟左右的时间进行收款确认，在此期间请勿重复支付。
      </p>
    </div>
    <!-- 图片展示区域 -->
    <img :src="selectedImage" alt="展示图片" class="modal-image" />
    <!-- 新增文本区域 -->
    <div class="modal-text">
      <p>
        <br />
        请于
        <span style="color: red">10分钟</span>
        内支付，超时未支付将自动取消订单。
        <br />
        请确保
        <span style="color: red">元、角、分</span>
        金额正确，
        <span style="color: red">系统将根据收款金额自动确认支付与否</span>。
        <br />
        如有任何问题可点击右上角图标与客服联系，我们将提供最优质的服务。
      </p>
    </div>
    <!-- 按钮区域 -->
    <!-- <div class="image-modal">
      <a-button @click="handleCancelOrder" v-if="props.cancle"> 取消订单 </a-button>
    </div> -->

    <!-- 使用 footer 插槽 -->
    <template #footer>
      <div style="display: inline-block">
        <a-button @click="handleCancelOrder" v-if="props.cancle" danger style="margin: 5px"
          >取消订单</a-button
        >
        <a-button @click="handleCancel" style="margin: 5px">{{ cancelButtonText }}</a-button>
      </div>
      <div style="display: inline-block">
        <a-button @click="handleShowOrderDetail(orderID)" v-if="props.cancle" style="margin: 5px"
          >查看订单</a-button
        >
        <a-button type="primary" @click="handleOk" style="margin: 5px">{{ okButtonText }}</a-button>
      </div>
    </template>
  </a-modal>
  <OrderDetailModal ref="orderDetailModal" />
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { UserGetOrdersApi, UserUpdateOrderApi } from '@/api/user/orders';
  import { useUserStore } from '@/store/modules/user';
  import { Divider, message } from 'ant-design-vue';
  import OrderDetailModal from './OrderDetailModal.vue';

  const orderDetailModal = ref<typeof OrderDetailModal>();
  const handleShowOrderDetail = (orderID) => {
    orderDetailModal.value.show(orderID);
  };
  const userstore = useUserStore();
  const userID = userstore.getUserId;
  const props = defineProps<{
    type: 'pay' | 'contact';
    orderID: number;
    cancle: boolean;
    showAction: boolean;
  }>();
  const formattedPrice = computed(() => {
    return orderDetails.value ? orderDetails.value.price.toFixed(2) : '0.00';
  });

  watch(
    () => [props.orderID],
    ([userID, orderID]) => {
      if (userID && orderID) {
        fetchOrderDetails(orderID);
        visible.value = true;
      }
    },
    { immediate: true }, // 组件挂载时立即执行
  );
  const visible = ref(false);
  const orderDetails = ref<any>();
  const fetchOrderDetails = async (orderID) => {
    try {
      const orders = await UserGetOrdersApi({ userID: userID, orderID: orderID });
      orderDetails.value = orders[0];
      visible.value = true;
    } catch (error) {
      console.error('Failed to fetch order details', error);
    }
  };

  const show = (orderID) => {
    fetchOrderDetails(orderID);
  };

  // Expose the show method to parent components without importing defineExpose
  defineExpose({ show });

  const emit = defineEmits<{
    (
      action: 'action',
      payload: {
        action: 'ok' | 'cancel' | 'cancelOrder';
        type: 'pay' | 'contact';
        orderID: number;
      },
    ): void;
  }>();
  const modalTitle = computed(() => {
    if (!orderDetails.value) return '';
    return props.type === 'pay' ? '支付' : '联系信息';
  });

  // 使用computed来确定要展示的图片路径
  const selectedImage = computed(() => {
    if (props.type === 'pay') {
      return new URL('@/assets/images/wechatPay.jpg', import.meta.url).href;
    } else if (props.type === 'contact') {
      return new URL('@/assets/images/wechatContact.jpg', import.meta.url).href;
    }
    return '';
  });

  // 根据type确定右下角按钮的文字
  const okButtonText = computed(() => {
    return props.showAction ? (props.type === 'pay' ? '我已经付好啦' : '确认联系') : '';
  });

  const cancelButtonText = computed(() => {
    return props.type === 'pay' ? '我再考虑一下' : '取消联系';
  });

  function handleOk() {
    visible.value = false;
    if (props.type === 'pay') {
      // 修改订单状态为已支付
      // UserUpdateOrderApi({ userID: userID, orderID: props.orderID, status: 2 })
      //   .then(() => {
      //     emit('action', { action: 'ok', type: props.type, orderID: props.orderID });
      //   })
      //   .catch((error) => {
      //     console.error('Failed to update order status', error);
      //   });
      message.info('系统正在确认付款中~');
      emit('action', { action: 'ok', type: props.type, orderID: props.orderID });
    }
  }

  function handleCancel() {
    visible.value = false;
    emit('action', { action: 'cancel', type: props.type, orderID: props.orderID });
  }
  function handleCancelOrder() {
    visible.value = false;
    UserUpdateOrderApi({ userID: userID, orderID: props.orderID, status: -1 })
      .then(() => {
        emit('action', { action: 'cancelOrder', type: props.type, orderID: props.orderID });
        message.success('取消订单成功');
      })
      .catch((error) => {
        console.error('Failed to update order status', error);
      });
  }
</script>

<style lang="less" scoped>
  .image-modal {
    // margin-top: 20px;
    text-align: center;
  }

  .view-image-button {
    padding: 4px 15px;
    transition: background-color 0.3s ease;
    border: none;
    border-radius: 4px;
    background-color: #0960bd;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }

  .view-image-button:hover {
    background-color: #0960bd;
  }

  .modal-image {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    margin-top: 16px;
  }

  .modal-text {
    margin-top: 16px;
    font-size: 14px;
  }
</style>
