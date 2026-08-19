<script setup lang="ts">
import type { FilterConfig } from '@/types/common.types';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { reactive } from 'vue';

const props = defineProps<{
  configs: FilterConfig[];
}>();

const emit = defineEmits<{
  (e: 'search', values: Record<string, any>): void;
  (e: 'reset'): void;
}>();

const model = reactive<Record<string, any>>({});

// Initialize defaults
props.configs.forEach((cfg) => {
  if (cfg.defaultValue !== undefined) {
    model[cfg.key] = cfg.defaultValue;
  }
});

function onSearch() {
  emit('search', { ...model });
}

function onReset() {
  props.configs.forEach((cfg) => {
    model[cfg.key] = cfg.defaultValue !== undefined ? cfg.defaultValue : undefined;
  });
  emit('reset');
}
</script>

<template>
  <div class="filter-custom-wrapper">
    <a-form layout="inline" class="filter-form flex items-center flex-wrap gap-3">
      <template v-for="cfg in configs" :key="cfg.key">
        <a-form-item :label="cfg.label">
          <!-- Text Input -->
          <a-input
            v-if="cfg.type === 'text'"
            v-model:value="model[cfg.key]"
            :placeholder="cfg.placeholder || 'Nhập từ khóa...'"
            allow-clear
            @press-enter="onSearch"
          />

          <!-- Select -->
          <a-select
            v-else-if="cfg.type === 'select'"
            v-model:value="model[cfg.key]"
            :placeholder="cfg.placeholder || 'Chọn...'"
            style="min-width: 160px"
            allow-clear
          >
            <a-select-option
              v-for="opt in cfg.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </a-select-option>
          </a-select>

          <!-- DatePicker -->
          <a-date-picker
            v-else-if="cfg.type === 'date'"
            v-model:value="model[cfg.key]"
            style="width: 150px"
          />

          <!-- RangePicker -->
          <a-range-picker
            v-else-if="cfg.type === 'dateRange'"
            v-model:value="model[cfg.key]"
          />
        </a-form-item>
      </template>

      <!-- Action Buttons -->
      <a-form-item>
        <div class="flex items-center gap-2">
          <a-button type="primary" @click="onSearch">
            <SearchOutlined /> Tìm kiếm
          </a-button>
          <a-button @click="onReset">
            <RedoOutlined /> Làm mới
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.filter-custom-wrapper {
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}
.filter-form {
  row-gap: 12px;
}
</style>
