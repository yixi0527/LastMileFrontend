<template>
  <div style="width: 100%">
    <div class="flex items-center">
      <slot name="tableTitle" v-if="$slots.tableTitle"></slot>
      <TableTitle
        :helpMessage="titleHelpMessage"
        :title="title"
        v-if="!$slots.tableTitle && title"
      />
      <div :class="`${prefixCls}__toolbar`">
        <slot name="toolbar"></slot>
        <a-button type="primary" @click="addData">添加数据</a-button>
        <a-button danger @click="props.deleteSelectRowByKey!">删除选中数据</a-button>
        <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" />
        <TableSettingComponent
          :setting="tableSetting"
          v-if="showTableSetting"
          @columns-change="handleColumnChange"
        />
      </div>
    </div>
    <a-modal v-model:visible="visible" title="创建">
      <BasicForm @register="register" :schemas="schema" :showActionButtonGroup="false" />
      <template #footer>
        <a-button @click="handleSubmit" type="primary">确认</a-button>
        <a-button @click="visible = false">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import type { TableSetting, ColumnChangeParam, TableActionType } from '../types/table';
  import type { PropType } from 'vue';
  import { Divider } from 'ant-design-vue';
  import TableSettingComponent from './settings/index.vue';
  import TableTitle from './TableTitle.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { RoleEnum } from '@/enums/roleEnum';
  import { AdminCreatePlatformAdminApi } from '@/api/admin/platformAdmin';
  import { AdminCreateUserApi } from '@/api/admin/user';
  import { AdminCreateDeliveryApi } from '@/api/admin/delivery';
  import { AdminCreateOrderApi } from '@/api/admin/order';
  import { ref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import {
    adminFormSchema,
    orderFormSchema,
    userFormSchema,
    deliveryFormSchema,
  } from '@/constants/info';
  import message from '@/views/form-design/utils/message';

  defineOptions({ name: 'BasicTableHeader' });

  const props = defineProps({
    title: {
      type: [Function, String] as PropType<string | ((data) => string)>,
    },
    tableSetting: {
      type: Object as PropType<TableSetting>,
    },
    showTableSetting: {
      type: Boolean,
    },
    titleHelpMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    clearSelectedRowKeys: {
      type: Function as PropType<TableActionType['clearSelectedRowKeys']>,
    },
    deleteSelectRowByKey: {
      type: Function as PropType<TableActionType['deleteSelectRowByKey']>,
    },
    role: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    showSelectionBar: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['columns-change']);
  const { prefixCls } = useDesign('basic-table-header');
  function handleColumnChange(data: ColumnChangeParam[]) {
    emit('columns-change', data);
  }

  // 模态框状态
  const visible = ref(false);
  const schema = ref([]);
  const [register, { validate }] = useForm({
    labelWidth: 100,
    schemas: schema,
    actionColOptions: {
      span: 14,
    },
    showResetButton: true,
  });

  function addData() {
    switch (props.role) {
      case RoleEnum.ADMIN:
        schema.value = adminFormSchema;
        break;
      case RoleEnum.USER:
        schema.value = userFormSchema;
        break;
      case RoleEnum.DeliveryPerson:
        schema.value = deliveryFormSchema;
        break;
      case 'order':
        schema.value = orderFormSchema;
        break;
    }
    visible.value = true;
  }

  async function handleSubmit() {
    try {
      const formData = await validate();
      if (formData) {
        await customSubmitFunc(formData).then(() => {
          message.success('创建成功，请刷新表格');
          visible.value = false; // 关闭模态框
        });
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }

  function customSubmitFunc(formData) {
    switch (props.role) {
      case RoleEnum.ADMIN:
        return AdminCreatePlatformAdminApi(formData);
      case RoleEnum.USER:
        return AdminCreateUserApi(formData);
      case RoleEnum.DeliveryPerson:
        return AdminCreateDeliveryApi(formData);
      case 'order':
        return AdminCreateOrderApi(formData);
    }
    return Promise.reject('未知角色');
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header';

  .@{prefix-cls} {
    &__toolbar {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-right: 8px;
      }
    }
  }
</style>
