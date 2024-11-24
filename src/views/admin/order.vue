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
  import { AdminGetOrderListApi, AdminUpdateOrderInfoApi } from '@/api/admin/order';
  import { AddressOptions } from '@/constants/locationOptions';
  import { statusMap } from '../order/statusMap';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const columns: BasicColumn[] = [
    {
      title: '订单ID',
      dataIndex: 'orderID',
      width: 80,
      sorter: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userID',
      width: 80,
      sorter: true,
    },
    {
      title: '配送员ID',
      dataIndex: 'deliveryPersonID',
      width: 90,
      sorter: true,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      editComponent: 'Select',
      editComponentProps: {
        options: Object.entries(statusMap).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      },
      width: 150,
      editRow: true,
      sorter: true,
    },
    {
      title: '订单信息',
      dataIndex: 'itemInfo',
      width: 200,
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
      title: '取货地址',
      dataIndex: 'pickupAddress',
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
      title: '收货地址',
      dataIndex: 'deliveryAddress',
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
      title: '订单金额',
      dataIndex: 'price',
      width: 100,
      sorter: true,
    },
    {
      title: '配送员收入',
      dataIndex: 'salary',
      width: 100,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 200,
      sorter: true,
    },
    {
      title: '开始时间',
      dataIndex: 'orderBeginTime',
      width: 200,
      sorter: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      width: 200,
      sorter: true,
    },
    {
      title: '完成时间',
      dataIndex: 'orderEndTime',
      width: 200,
      sorter: true,
    },
  ];

  const { createMessage: msg } = useMessage();
  const currentEditKeyRef = ref('');
  const [registerTable] = useTable({
    title: '订单管理',
    titleHelpMessage: ['订单管理'],
    api: (params) => AdminGetOrderListApi({ ...params, AdminID: userStore.getUserId }),
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
    role: 'order',
  });
  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: `orderID`,
          label: `订单ID`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 6,
          },
        },
        {
          field: `userID`,
          label: `用户ID`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 6,
          },
        },
        {
          field: `deliveryID`,
          label: `配送员ID`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 6,
          },
        },
        {
          field: `status`,
          label: `订单状态`,
          component: 'Select',
          colProps: {
            xl: 12,
            xxl: 6,
          },
          componentProps: {
            options: Object.entries(statusMap).map(([key, value]) => ({
              label: value,
              value: key,
            })),
          },
        },
        {
          field: `pickupAddress`,
          label: `取货地址`,
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
          field: `deliveryAddress`,
          label: `收货地址`,
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
          field: `phoneNumber`,
          label: `联系电话`,
          component: 'Input',
          colProps: {
            xl: 12,
            xxl: 8,
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

        changedData.orderID = record.orderID;
        changedData.userID = record.userID; // 保留userID用于API调用

        // 修改正在编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
          console.log('update data', changedData);
          // 提交服务器保存
          await AdminUpdateOrderInfoApi(changedData).then((res) => {
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
