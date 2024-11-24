<template>
  <!-- 模态框 -->
  <a-modal
    v-model:open="visible"
    title="评分"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :okText="okButtonText"
    :cancelText="cancelButtonText"
  >
    <div>
      <!-- 评分栏 -->
      <Rate v-model:value="ratingValue" />

      <!-- 留言输入框 -->
      <a-input
        v-model:value="comment"
        placeholder="我们期待您的留言与反馈！"
        style="margin-top: 16px"
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, computed, inject, defineEmits } from 'vue';
  import { UserReviewOrderApi, UserUpdateOrderApi } from '@/api/user/orders';
  import Rate from 'ant-design-vue/es/rate';
  import { useUserStore } from '@/store/modules/user';

  const fetchOrders = inject<typeof fetchOrders>('fetchOrders');
  const userStore = useUserStore();
  const visible = ref(false);
  const ratingValue = ref<number>(2);
  const comment = ref<string>('');
  const orderID = ref<number>(0);
  const show = (currentOrderID: number) => {
    orderID.value = currentOrderID;
    visible.value = true;
  };
  defineExpose({ show });
  const emit = defineEmits<{
    (event: 'refreshOrders'): void;
  }>();
  // 提交评分的方法
  const handleSubmit = async () => {
    const review = {
      orderID: orderID.value,
      userID: userStore.getUserId,
      rating: ratingValue.value,
      comments: comment.value,
    };
    UserReviewOrderApi(review).then(() => {
      visible.value = false;
      console.log('评分成功', ratingValue.value, comment.value);
      UserUpdateOrderApi({
        orderID: orderID.value,
        userID: userStore.getUserId,
        status: 7,
      }).then(() => {
        // 提交成功后重新获取订单列表
        console.log('订单状态更新成功');
        emit('refreshOrders');
      });
    });
  };

  // 取消模态框的方法
  const handleCancel = () => {
    visible.value = false;
  };

  // 计算属性：按钮文字
  const okButtonText = computed(() => '提交');
  const cancelButtonText = computed(() => '取消');
</script>

<style scoped>
  div {
    display: inline-block;
    cursor: pointer;
  }

  .modal-image {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    margin-top: 16px;
  }
</style>
