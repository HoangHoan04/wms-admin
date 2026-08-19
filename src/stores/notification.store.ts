import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'stock' | 'system' | 'transfer';
  read: boolean;
  avatar?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Cảnh báo tồn kho thấp',
    description: 'Sản phẩm SKU-A109 (Thép cuộn D10) còn 12 đơn vị (dưới ngưỡng tối thiểu 50).',
    time: '5 phút trước',
    type: 'stock',
    read: false,
  },
  {
    id: '2',
    title: 'Đơn nhập kho mới #NK-2026-088',
    description: 'Kho Tổng TP.HCM vừa nhận 200 kiện hàng từ NCC Thép Việt.',
    time: '30 phút trước',
    type: 'order',
    read: false,
  },
  {
    id: '3',
    title: 'Yêu cầu chuyển kho được duyệt',
    description: 'Lệnh điều chuyển 50 pallet từ Kho A sang Kho B đã hoàn tất.',
    time: '2 giờ trước',
    type: 'transfer',
    read: true,
  },
];

export const useNotificationStore = defineStore('notification', () => {
  const list = ref<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = computed(() => list.value.filter((n) => !n.read).length);

  function markAsRead(id: string) {
    const item = list.value.find((n) => n.id === id);
    if (item) item.read = true;
  }

  function markAllAsRead() {
    list.value.forEach((n) => (n.read = true));
  }

  function clearAll() {
    list.value = [];
  }

  return {
    list,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
});
