<template>
  <CollapseContainer
    title="基本设置"
    :canExpand="false"
    style="padding-right: 25px; padding-left: 25px"
  >
    <Row :gutter="24">
      <Col :span="24">
        <BasicForm @register="register" />
      </Col>
    </Row>
    <a-button type="primary" @click="handleSubmit" block size="large"> 保存 </a-button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { CollapseContainer } from '@/components/Container';
  import { BasicForm, useForm } from '@/components/Form';
  import { Col, message, Row } from 'ant-design-vue';
  import { onMounted, computed } from 'vue';
  import { getUserInfo, userUpdateInfo } from '@/api/user/self';
  import { useUserStore } from '@/store/modules/user';
  import { baseSetschemas } from './data';
  import { getUserID } from '@/utils/auth';
  import { deliveryUpdateInfo, getDeliveryPersonInfo } from '@/api/delivery/self';
  import { RoleEnum } from '@/enums/roleEnum';

  const modifiedSchemas = computed(() => {
    if (userStore.getRoleList.includes(RoleEnum.DeliveryPerson)) {
      return baseSetschemas.filter((schema) => !schema.field.includes('defaultDeliveryAddress'));
    } else {
      return baseSetschemas;
    }
  });

  const userStore = useUserStore();

  const [register, { setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: modifiedSchemas,
    showActionButtonGroup: false,
    submitFunc: handleSubmit,
  });

  onMounted(async () => {
    const role = userStore.getRoleList;
    let data;
    if (role.includes(RoleEnum.USER)) {
      data = await getUserInfo({ userID: getUserID() });
    } else if (role.includes(RoleEnum.DeliveryPerson)) {
      data = await getDeliveryPersonInfo({ deliveryPersonID: getUserID() });
    }
    setFieldsValue(data);
  });

  async function handleSubmit() {
    const values = await validate();
    values.defaultDeliveryAddress = values.defaultDeliveryAddress.join('/');
    const role = userStore.getRoleList;
    if (role.includes(RoleEnum.USER)) {
      const newInfo = { ...userStore.getUserInfo, ...values };
      newInfo.userID = getUserID();
      await userUpdateInfo(newInfo).then(() => {
        userStore.setUserInfo(newInfo);
        message.success('更新成功');
      });
    } else if (role.includes(RoleEnum.DeliveryPerson)) {
      const newInfo = { ...userStore.getUserInfo, ...values };
      delete newInfo.userID;
      newInfo.deliveryPersonID = getUserID();
      await deliveryUpdateInfo(newInfo).then(() => {
        userStore.setUserInfo(newInfo);
        message.success('更新成功');
      });
    }
  }
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
