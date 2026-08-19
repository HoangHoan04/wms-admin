<script setup lang="ts">
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import type { TablePaginationConfig } from 'ant-design-vue';

withDefaults(
  defineProps<{
    columns: any[];
    dataSource: any[];
    loading?: boolean;
    pagination?: TablePaginationConfig | false;
    rowKey?: string;
    title?: string;
    showTools?: boolean;
  }>(),
  {
    loading: false,
    rowKey: 'id',
    showTools: true,
  },
);

const emit = defineEmits<{
  (e: 'change', pagination: TablePaginationConfig, filters: any, sorter: any): void;
  (e: 'refresh'): void;
  (e: 'export'): void;
}>();

function onTableChange(pagination: TablePaginationConfig, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter);
}
</script>

<template>
  <div class="table-custom-wrapper">
    <!-- Header Tool Bar -->
    <div v-if="title || showTools" class="table-header-bar flex items-center justify-between">
      <div class="table-title">
        <span v-if="title" class="font-bold text-base">{{ title }}</span>
        <slot name="header-left" />
      </div>

      <div v-if="showTools" class="table-tools flex items-center gap-2">
        <slot name="header-right" />
        <a-tooltip title="Làm mới">
          <a-button shape="circle" size="small" @click="emit('refresh')">
            <ReloadOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="Xuất dữ liệu">
          <a-button shape="circle" size="small" @click="emit('export')">
            <DownloadOutlined />
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <!-- Ant Design Table -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      size="middle"
      class="table-custom-inner"
      @change="onTableChange"
    >
      <template #bodyCell="slotProps">
        <slot name="bodyCell" v-bind="slotProps" />
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.table-custom-wrapper {
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.table-header-bar {
  margin-bottom: 16px;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
