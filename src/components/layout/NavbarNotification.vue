<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';

const store = useNotificationStore();
const list = computed(() => store.list);
const unreadCount = computed(() => store.unreadCount);
</script>

<template>
  <a-popover trigger="click" placement="bottomRight" overlay-class-name="notif-popover">
    <template #content>
      <div class="notif-container">
        <div class="notif-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold">Thông báo</span>
            <a-badge :count="unreadCount" :overflow-count="99" />
          </div>
          <div class="flex items-center gap-2">
            <a-button type="link" size="small" @click="store.markAllAsRead">
              <CheckOutlined /> Đọc hết
            </a-button>
            <a-button type="link" size="small" danger @click="store.clearAll">
              <DeleteOutlined /> Xóa
            </a-button>
          </div>
        </div>

        <div class="notif-list">
          <div
            v-for="item in list"
            :key="item.id"
            class="notif-item"
            :class="{ unread: !item.read }"
            @click="store.markAsRead(item.id)"
          >
            <div class="notif-title">{{ item.title }}</div>
            <div class="notif-desc">{{ item.description }}</div>
            <div class="notif-time">{{ item.time }}</div>
          </div>
          <div v-if="list.length === 0" class="notif-empty">
            Không có thông báo mới
          </div>
        </div>
      </div>
    </template>

    <div class="notif-trigger cursor-pointer flex items-center justify-center">
      <a-badge :count="unreadCount" :offset="[2, -2]">
        <BellOutlined class="notif-icon" />
      </a-badge>
    </div>
  </a-popover>
</template>

<style scoped>
.notif-trigger {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-size: 18px;
}
.notif-trigger:hover {
  background: var(--muted);
}
.notif-icon {
  font-size: 18px;
  color: var(--foreground);
}
.notif-container {
  width: 320px;
}
.notif-header {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}
.notif-list {
  max-height: 320px;
  overflow-y: auto;
}
.notif-item {
  padding: 8px 10px;
  border-radius: var(--radius-md);
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.notif-item:hover {
  background: var(--muted);
}
.notif-item.unread {
  background: var(--primary-muted);
}
.notif-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}
.notif-desc {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.4;
}
.notif-time {
  font-size: 11px;
  color: var(--muted-foreground);
  margin-top: 4px;
}
.notif-empty {
  text-align: center;
  padding: 24px 0;
  color: var(--muted-foreground);
}
</style>
