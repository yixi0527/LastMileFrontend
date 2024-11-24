// util.ts
import { getCurrentInstance } from 'vue';

export const getStatusText = (status: number): string => {
  const instance = getCurrentInstance();
  const statusMap = instance?.appContext.config.globalProperties.$statusMap;

  return statusMap && status in statusMap ? statusMap[status] : 'Unknown Status';
};
