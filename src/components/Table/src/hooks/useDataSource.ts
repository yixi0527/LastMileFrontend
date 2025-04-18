import type { BasicTableProps, FetchParams, SorterResult } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import {
  ref,
  unref,
  ComputedRef,
  computed,
  onMounted,
  watch,
  reactive,
  Ref,
  watchEffect,
} from 'vue';
import { useTimeoutFn } from '@vben/hooks';
import { buildUUID } from '@/utils/uuid';
import { isFunction, isBoolean, isObject } from '@/utils/is';
import { get, cloneDeep, merge, rest } from 'lodash-es';
import { FETCH_SETTING, ROW_KEY, PAGE_SIZE } from '../const';
import { parseRowKeyValue } from '../helper';
import type { Key } from 'ant-design-vue/lib/table/interface';

interface ActionType {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  setLoading: (loading: boolean) => void;
  getFieldsValue: () => Recordable;
  clearSelectedRowKeys: () => void;
  tableData: Ref<Recordable[]>;
}

interface SearchState {
  sortInfo: Recordable;
  filterInfo: Record<string, string[]>;
}
export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  {
    getPaginationInfo,
    setPagination,
    setLoading,
    getFieldsValue,
    clearSelectedRowKeys,
    tableData,
  }: ActionType,
  emit: EmitType,
) {
  const searchState = reactive<SearchState>({
    sortInfo: {},
    filterInfo: {},
  });
  const dataSourceRef = ref<Recordable[]>([]);
  const rawDataSourceRef = ref<Recordable>({});
  const searchInfoRef = ref<Recordable>({});

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, api } = unref(propsRef);
      !api && dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    },
  );

  function handleTableChange(
    pagination: PaginationProps,
    filters: Partial<Recordable<string[]>>,
    sorter: SorterResult,
  ) {
    const { clearSelectOnPageChange, sortFn, filterFn } = unref(propsRef);
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys();
    }
    setPagination(pagination);

    const params: Recordable = {};
    if (sorter && isFunction(sortFn)) {
      const sortInfo = sortFn(sorter);
      searchState.sortInfo = sortInfo;
      params.sortInfo = sortInfo;
    }

    if (filters && isFunction(filterFn)) {
      const filterInfo = filterFn(filters);
      searchState.filterInfo = filterInfo;
      params.filterInfo = filterInfo;
    }
    fetch(params);
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  }

  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
  });

  const getDataSourceRef: Ref<Recordable<any>[]> = ref([]);

  watch(
    () => dataSourceRef.value,
    () => {
      const dataSource = unref(dataSourceRef);
      if (!dataSource || dataSource.length === 0) {
        getDataSourceRef.value = unref(dataSourceRef);
      }
      if (unref(getAutoCreateKey)) {
        const firstItem = dataSource[0];
        const lastItem = dataSource[dataSource.length - 1];

        if (firstItem && lastItem) {
          if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
            const data = cloneDeep(unref(dataSourceRef));
            data.forEach((item) => {
              if (!item[ROW_KEY]) {
                item[ROW_KEY] = buildUUID();
              }
              if (item.children && item.children.length) {
                setTableKey(item.children);
              }
            });
            dataSourceRef.value = data;
          }
        }
      }
      getDataSourceRef.value = unref(dataSourceRef);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  async function updateTableData(index: number, key: Key, value: any) {
    const record = dataSourceRef.value[index];
    if (record) {
      dataSourceRef.value[index][key] = value;
    }
    return dataSourceRef.value[index];
  }

  function updateTableDataRecord(keyValue: Key, record: Recordable): Recordable | undefined {
    const row = findTableDataRecord(keyValue);

    if (row) {
      for (const field in row) {
        if (Reflect.has(record, field)) row[field] = record[field];
      }
      return row;
    }
  }

  function deleteTableDataRecord(keyValues: Key | Key[]) {
    if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    const delKeyValues = !Array.isArray(keyValues) ? [keyValues] : keyValues;

    function deleteRow(data, keyValue) {
      const row: { index: number; data: [] } = findRow(data, keyValue);
      if (row === null || row.index === -1) {
        return;
      }
      row.data.splice(row.index, 1);

      function findRow(data, keyValue) {
        if (data === null || data === undefined) {
          return null;
        }
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          if (parseRowKeyValue(unref(getRowKey), row) === keyValue) {
            return { index: i, data };
          }
          if (row.children?.length > 0) {
            const result = findRow(row.children, keyValue);
            if (result != null) {
              return result;
            }
          }
        }
        return null;
      }
    }

    for (const keyValue of delKeyValues) {
      deleteRow(dataSourceRef.value, keyValue);
      deleteRow(unref(propsRef).dataSource, keyValue);
    }
    setPagination({
      total: unref(propsRef).dataSource?.length,
    });
  }

  function insertTableDataRecord(
    record: Recordable | Recordable[],
    index?: number,
  ): Recordable[] | undefined {
    // if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
    index = index ?? dataSourceRef.value?.length;
    const _record = isObject(record) ? [record as Recordable] : (record as Recordable[]);
    unref(dataSourceRef).splice(index, 0, ..._record);
    return unref(dataSourceRef);
  }

  function findTableDataRecord(keyValue: Key) {
    if (!dataSourceRef.value || dataSourceRef.value.length === 0) return;
    const { childrenColumnName = 'children' } = unref(propsRef);

    const findRow = (array: any[]) => {
      let ret;
      array.some(function iter(r) {
        if (parseRowKeyValue(unref(getRowKey), r) === keyValue) {
          ret = r;
          return true;
        }
        return r[childrenColumnName] && r[childrenColumnName].some(iter);
      });
      return ret;
    };

    return findRow(dataSourceRef.value);
  }

  async function fetch(opt?: FetchParams) {
    const {
      api,
      searchInfo,
      defSort,
      fetchSetting,
      beforeFetch,
      afterFetch,
      useSearchForm,
      pagination,
    } = unref(propsRef);
    if (!api || !isFunction(api)) return;
    try {
      setLoading(true);
      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting,
      );
      let pageParams: Recordable = {};

      const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo) as PaginationProps;

      if ((isBoolean(pagination) && !pagination) || isBoolean(getPaginationInfo)) {
        pageParams = {};
      } else {
        pageParams[pageField] = (opt && opt.page) || current;
        pageParams[sizeField] = pageSize;
      }

      const { sortInfo = {}, filterInfo } = searchState;

      let params: Recordable = merge(
        pageParams,
        useSearchForm ? getFieldsValue() : {},
        searchInfo,
        opt?.searchInfo ?? {},
        defSort,
        sortInfo,
        filterInfo,
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {},
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      searchInfoRef.value = params;
      // 搜索表单逻辑
      params.defaultDeliveryAddress = params.defaultDeliveryAddress?.join('/');
      // params.defaultPickupAddress = params.defaultPickupAddress?.join('/');
      params.pickupAddress = params.pickupAddress?.join('/');
      params.deliveryAddress = params.deliveryAddress?.join('/');
      const realPage = params.page;
      const realPageSize = params.pageSize;
      params.pageSize = getFieldsValue() ? 99999 : params.pageSize;
      params.page = getFieldsValue() ? 1 : params.page;

      const res = await api(params);
      const { page: _page, pageSize: _pageSize, field, order, ...restParams } = params;
      if (field && order) {
        res.rows.sort((a, b) => {
          const valueA = field.includes('time') ? new Date(a[field]) : a[field];
          const valueB = field.includes('time') ? new Date(b[field]) : b[field];
          if (order === 'ascend') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });
      }
      if (restParams) {
        res.rows = res.rows.filter((row) => {
          return Object.keys(restParams).every((key) => {
            if (restParams[key] === undefined) return true;
            // 检查 row 中的键是否包含 restparams 中的关键字
            if (key === 'status') {
              return row[key]?.toString() === restParams[key].toString();
            } else {
              return row[key]?.toString().includes(restParams[key]);
            }
          });
        });
      }
      rawDataSourceRef.value = res;
      // const isArrayResult = Array.isArray(res);
      // let resultItems: Recordable[] = isArrayResult ? res : get(res, listField);
      let resultItems: Recordable[] = res.rows.slice(
        (realPage - 1) * realPageSize,
        realPage * realPageSize,
      );

      // const resultTotal: number = isArrayResult ? res.length : get(res, totalField);
      const resultTotal: number = res.rows.length;

      // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
      if (Number(resultTotal)) {
        const currentTotalPage = Math.ceil(resultTotal / pageSize);
        if (current > currentTotalPage) {
          setPagination({
            current: currentTotalPage,
          });
          return await fetch(opt);
        }
      }

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      });
      return resultItems;
    } catch (error) {
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function setTableData<T = Recordable>(values: T[]) {
    dataSourceRef.value = values as Recordable[];
  }

  function getDataSource<T = Recordable>() {
    return getDataSourceRef.value as T[];
  }

  function getRawDataSource<T = Recordable>() {
    return rawDataSourceRef.value as T;
  }

  async function reload(opt?: FetchParams) {
    return await fetch(opt);
  }

  function getSearchInfo<T = Recordable>() {
    return searchInfoRef.value as T;
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {
    getDataSourceRef: computed(() => getDataSourceRef.value),
    getDataSource,
    getRawDataSource,
    searchInfoRef,
    getSearchInfo,
    getRowKey,
    setTableData,
    getAutoCreateKey,
    fetch,
    reload,
    updateTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    handleTableChange,
  };
}
