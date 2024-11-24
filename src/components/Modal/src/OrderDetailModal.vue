<template>
  <a-modal :open="visible" @cancel="handleCancel" footer="" title="订单详情">
    <div v-if="orderDetails" class="order-details">
      <a-row gutter="{24}">
        <a-col span="{24}" width="32px">
          <a-card title="Order Information" bordered>
            <p style="margin-top: 10px"><strong>订单编号：</strong> {{ orderDetails.orderID }}</p>
            <p style="color: red"
              ><strong>订单状态：</strong>
              <span>{{ getStatusText(orderDetails.status) }}</span>
            </p>
            <p><strong>取货地址：</strong> {{ orderDetails.pickupAddress }}</p>
            <p style="color: red"><strong>收货地址：</strong> {{ orderDetails.deliveryAddress }}</p>
            <p><strong>联系电话：</strong>{{ orderDetails.phoneNumber }}</p>
            <p
              ><strong>订单信息：</strong>
              {{ orderDetails.itemInfo ? orderDetails.itemInfo : '无' }}</p
            >
            <p style="color: red">
              <strong> 取货码/取餐码：</strong
              >{{ orderDetails.pickupCode ? orderDetails.pickupCode : '无' }}</p
            >
            <p><strong>订单备注：</strong> {{ orderDetails.note ? orderDetails.note : '无' }}</p>
            <div v-if="userStore.getRoleList[0] == RoleEnum.USER">
              <p><strong>订单金额：</strong> {{ orderDetails.price.toFixed(2) }}元</p>
            </div>
            <div v-if="userStore.getRoleList[0] == RoleEnum.DeliveryPerson">
              <p><strong>预计收入：</strong> {{ orderDetails.price.toFixed(2) }}元</p>
            </div>
            <p
              ><strong>订单创建时间：</strong>
              {{ orderDetails.createdTime?.replace('T', ' ') || 'N/A' }}</p
            >
            <p
              ><strong>订单结束时间：</strong>
              {{ orderDetails.orderEndTime?.replace('T', ' ') || '未结束' }}</p
            >
          </a-card>
        </a-col>

        <a-col span="{24}" width="24px">
          <a-button
            v-if="userStore.getRoleList[0] == RoleEnum.DeliveryPerson && orderDetails.status === 2"
            type="primary"
            @click="handleAcc"
          >
            接单
          </a-button>
          <a-button
            v-if="userStore.getRoleList[0] == RoleEnum.DeliveryPerson && orderDetails.status === 3"
            type="primary"
            @click="handleChangeStatus(orderDetails.status)"
          >
            已取到货
          </a-button>
          <a-button
            v-if="userStore.getRoleList[0] == RoleEnum.DeliveryPerson && orderDetails.status === 4"
            type="primary"
            @click="handleChangeStatus(orderDetails.status)"
          >
            货已送达
          </a-button>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getStatusText } from '@/utils/getStatusText';
  import { OrderModel } from '@/api/model/orderModel';
  import { UserGetOrdersApi } from '@/api/user/orders';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';
  import {
    DeliveryGetAvailableOrdersApi,
    DeliveryUpdateOrderApi,
    DeliveryGetMyOrdersApi,
  } from '@/api/delivery/orders';
  import { getDeliveryPersonInfo } from '@/api/delivery/self';
  import { message, Modal } from 'ant-design-vue';
  import ARow from 'ant-design-vue/es/grid/Row';
  import ACol from 'ant-design-vue/es/grid/Col';

  const userStore = useUserStore();
  const props = defineProps<{
    userID: number;
  }>();

  const visible = ref(false);
  const orderDetails = ref<OrderModel>();
  const emit = defineEmits(['newStatus']);
  const fetchOrderDetails = async (orderID) => {
    try {
      if (userStore.getRoleList[0] == RoleEnum.USER) {
        const orders = await UserGetOrdersApi({ userID: userStore.getUserId, orderID: orderID });
        orderDetails.value = orders[0];
      } else if (userStore.getRoleList[0] == RoleEnum.DeliveryPerson) {
        const myOrders =
          (await DeliveryGetMyOrdersApi({
            deliveryID: props.userID,
          })) || [];
        const avaliableOrders =
          (await DeliveryGetAvailableOrdersApi({
            deliveryID: props.userID,
          })) || [];
        const orders = [...myOrders, ...avaliableOrders];
        console.log('orders', orders);
        orderDetails.value = orders.find((order) => order.orderID === orderID);
      }
      visible.value = true;
    } catch (error) {
      console.error('Failed to fetch order details', error);
    }
  };

  const show = (orderID) => {
    fetchOrderDetails(orderID);
  };

  const handleCancel = () => {
    visible.value = false;
  };
  // Expose the show method to parent components without importing defineExpose
  defineExpose({ show });

  const handleAcc = () => {
    getDeliveryPersonInfo({ deliveryPersonID: props.userID })
      .then((res) => {
        console.log(res);
        if (res.status === 1) {
          message.warning('请先在右上角修改为可接单状态');
          return;
        } else {
          Modal.confirm({
            title: '确认接单',
            content: '您确定要接单吗？',
            onOk() {
              console.log('acc');
              DeliveryUpdateOrderApi({
                orderID: orderDetails.value?.orderID,
                status: 3,
                deliveryPersonID: props.userID,
              })
                .then((res) => {
                  console.log(res);
                  emit('newStatus', 3);
                })
                .catch((err) => {
                  console.error(err);
                });
            },
          });
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
    visible.value = false;
  };

  const handleChangeStatus = (status: number) => {
    if (status === 3) {
      Modal.confirm({
        title: '确认已取到货',
        content: '您确定已取到货吗？',
        onOk() {
          console.log('acc');
          DeliveryUpdateOrderApi({
            orderID: orderDetails.value?.orderID,
            status: 4,
            deliveryPersonID: props.userID,
          })
            .then((res) => {
              console.log(res);
              emit('newStatus', 4);
            })
            .catch((err) => {
              console.error(err);
            });
        },
      });
    } else if (status === 4) {
      Modal.confirm({
        title: '确认货已送达',
        content: '您确定货已送达吗？',
        onOk() {
          console.log('acc');
          DeliveryUpdateOrderApi({
            orderID: orderDetails.value?.orderID,
            status: 5,
            deliveryPersonID: props.userID,
          })
            .then((res) => {
              console.log(res);
              emit('newStatus', 5);
            })
            .catch((err) => {
              console.error(err);
            });
        },
      });
    }
    visible.value = false;
    console.log('status', status);
    if (orderDetails.value) {
      orderDetails.value.status = status;
    }
  };
</script>

<style scoped>
  .ant-modal-content {
    padding: 24px;
  }
</style>
