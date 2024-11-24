<template>
  <div class="p-4">
    <BasicTable @register="registerTable" @edit-change="onEditChange" :role="'user'">
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
  import { AdminGetUserListApi, AdminUpdateUserInfoApi } from '@/api/admin/user'; // 更新API导入路径
  import { AddressOptions } from '@/constants/locationOptions';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '@/enums/roleEnum';

  const userStore = useUserStore();

  const columns: BasicColumn[] = [
    {
      title: '用户ID',
      dataIndex: 'userID',
      width: 60,
      sorter: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      editRow: true,
      sorter: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNumber',
      editRow: true,
      width: 100,
      sorter: true,
    },
    {
      title: '默认地址',
      dataIndex: 'defaultDeliveryAddress',
      editRow: true,
      editComponent: 'Cascader',
      editRule: false,
      editComponentProps: {
        options: AddressOptions,
      },
      width: 200,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 100,
      sorter: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      width: 100,
      sorter: true,
    },
  ];

  const { createMessage: msg } = useMessage();
  const currentEditKeyRef = ref('');
  const [registerTable] = useTable({
    title: '用户管理',
    titleHelpMessage: ['用户管理'],
    api: (params) => AdminGetUserListApi({ ...params, AdminID: userStore.getUserId }),
    columns: columns,
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
    useSearchForm: true,
    formConfig: getFormConfig(),
    role: RoleEnum.USER,
  });
  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: `userID`,
          label: `用户ID`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
          },
        },
        {
          field: `username`,
          label: `用户名`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
          },
        },
        {
          field: `phoneNumber`,
          label: `联系电话`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
          },
        },
        {
          field: `defaultDeliveryAddress`,
          label: `默认地址`,
          component: 'Cascader',
          colProps: {
            xl: 12,
            xxl: 8,
          },
          componentProps: {
            options: AddressOptions,
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

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    if (!record.originalData) {
      record.originalData = cloneDeep(record); // 保存原始数据副本
    }
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
        const originalData = record.originalData;
        const editedData = cloneDeep(record.editValueRefs);

        // 过滤出发生变化的字段
        const changedData: Partial<typeof editedData> = {};
        for (const key in editedData) {
          if (editedData[key] !== originalData[key] && key !== 'userID') {
            changedData[key] = editedData[key];
          }
        }

        // 如果没有变化的数据，不进行API调用
        if (Object.keys(changedData).length === 0) {
          msg.info({ content: '未检测到数据变更', key: 'saving' });
          return;
        }

        changedData.userID = record.userID; // 保留userID用于API调用

        // 修改正在编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
          console.log('update data', changedData);
          // 提交服务器保存
          await AdminUpdateUserInfoApi(changedData).then((res) => {
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
