<template>
  <Modal title="请完善信息以完成注册" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <Form
      ref="formRef"
      :model="formState"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      :isDelivery="false"
      autocomplete="off"
      @keypress.enter="handleOk"
    >
      <FormItem
        label="用户名"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" placeholder="请输入用户名" />
      </FormItem>

      <FormItem
        label="密码"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { message, Modal, Form } from 'ant-design-vue';
  import { useUserStoreWithOut } from '@/store/modules/user';
  import { UserCompleteInfo } from '@/api/user/self';
  import { useFormValid } from '@/views/sys/login/useLogin';
  import { deliveryCompleteInfo } from '@/api/delivery/self';

  const FormItem = Form.Item;
  const props = defineProps<{
    visible: boolean;
    phoneNumber: string;
    isDelivery: boolean;
  }>();

  interface FormState {
    username: string;
    password: string;
  }

  const formState = reactive<FormState>({
    username: '',
    password: '',
  });

  const emit = defineEmits(['update:visible']);

  const formRef = ref();

  const userStore = useUserStoreWithOut();
  const { validForm } = useFormValid(formRef);
  const handleOk = async () => {
    try {
      const data = await validForm();
      const registerData = {
        ...data,
        phoneNumber: props.phoneNumber,
      };

      if (props.isDelivery) {
        await deliveryCompleteInfo(registerData).then(() => {
          message.success('注册成功');
          // 调用登录接口
          userStore.login({
            username: formState.username,
            password: formState.password,
            isDelivery: true,
            mode: 'modal', // 可选，具体根据需求
          });
        });
      } else {
        // 调用注册接口
        await UserCompleteInfo(registerData).then(() => {
          message.success('注册成功');
          // 调用登录接口
          userStore.login({
            username: formState.username,
            password: formState.password,
            isDelivery: false,
            mode: 'modal', // 可选，具体根据需求
          });
        });
      }

      emit('update:visible', false);
    } catch (error) {
      console.error('注册或登录失败', error);
    }
  };

  const handleCancel = () => {
    message.info('取消注册');
    emit('update:visible', false);
  };
</script>
