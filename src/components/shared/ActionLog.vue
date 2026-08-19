<script setup lang="ts">
import type { ActionLogItem } from '@/types/common.types';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';

defineProps<{
  logs: ActionLogItem[];
}>();
</script>

<template>
  <div class="action-log-wrapper">
    <a-timeline>
      <a-timeline-item
        v-for="log in logs"
        :key="log.id"
        :color="log.status === 'SUCCESS' ? 'green' : log.status === 'FAILED' ? 'red' : 'orange'"
      >
        <template #dot>
          <CheckCircleOutlined v-if="log.status === 'SUCCESS'" style="color: #22c55e" />
          <CloseCircleOutlined v-else-if="log.status === 'FAILED'" style="color: #ef4444" />
          <ExclamationCircleOutlined v-else style="color: #f59e0b" />
        </template>

        <div class="log-item-content">
          <div class="flex items-center justify-between">
            <span class="log-action font-semibold">{{ log.action }}</span>
            <span class="log-time text-xs text-muted-foreground">{{ log.timestamp }}</span>
          </div>
          <div class="log-meta text-xs text-muted-foreground mt-1">
            <span>Bởi: <strong>{{ log.username }}</strong></span> &bull;
            <span>Phân hệ: {{ log.module }}</span> &bull;
            <span>IP: {{ log.ipAddress }}</span>
          </div>
          <div v-if="log.details" class="log-details text-xs mt-1">
            {{ log.details }}
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<style scoped>
.action-log-wrapper {
  padding: 12px 0;
}
.log-item-content {
  background: var(--muted);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  margin-top: -6px;
}
</style>
