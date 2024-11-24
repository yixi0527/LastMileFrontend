<template>
  <div class="p-4">
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
    FormProps,
  } from '@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { AdminGetPlatformAdminListApi } from '@/api/admin/platformAdmin';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';

  const userStore = useUserStore();

  const columns: BasicColumn[] = [
    {
      title: '管理员ID',
      dataIndex: 'adminID',
      width: 50,
      sorter: true,
    },
    {
      title: '管理员名',
      dataIndex: 'adminName',
      width: 50,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 200,
      sorter: true,
    },

    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      width: 200,
      sorter: true,
    },
  ];
  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: `adminID`,
          label: `管理员ID`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 6,
          },
        },
        {
          field: `adminName`,
          label: `管理员名`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 6,
          },
        },
        {
          field: `createdTime`,
          label: `创建时间`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
          },
        },
        {
          field: `updatedTime`,
          label: `更新时间`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
          },
        },
      ],
    };
  }
  const { createMessage: msg } = useMessage();
  const currentEditKeyRef = ref('');
  const [registerTable] = useTable({
    title: '订单管理',
    titleHelpMessage: ['订单管理'],
    api: (params) => AdminGetPlatformAdminListApi({ ...params, AdminID: userStore.getUserId }),
    columns: columns,
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
    useSearchForm: true,
    formConfig: getFormConfig(),
    role: RoleEnum.ADMIN,
  });

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  async function handleSave(record: EditRecordRow) {
    msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        const data = cloneDeep(record.editValueRefs);
        console.log(data);
        // 修改正在编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
          console.log('update data', data);
          // 提交服务器保存
          await AdminUpdateUserInfoApi(data).then((res) => {
            console.log(res);
            msg.success({ content: '数据已保存', key: 'saving' });
          });
        }
      } catch (error) {
        msg.error({ content: '保存失败', key: 'saving' });
      }
    } else {
      msg.error({ content: '请填写正确的数据', key: 'saving' });
    }
  }

  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record),
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: handleCancel.bind(null, record),
        },
      },
    ];
  }

  function onEditChange({ column, value, record }) {
    // 处理编辑更改逻辑
    console.log(column, value, record);
  }
</script>
