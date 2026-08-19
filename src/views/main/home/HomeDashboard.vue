<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import {
  ArrowUpOutlined,
  DropboxOutlined,
  InboxOutlined,
  PlusOutlined,
  ShopOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed } from 'vue';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const dashboardStore = useDashboardStore();
const isDark = computed(() => dashboardStore.isDarkMode);

const kpis = [
  {
    title: 'Tổng SKU trong kho',
    value: '14,280',
    unit: 'mặt hàng',
    growth: '+12.5%',
    isPositive: true,
    icon: DropboxOutlined,
    color: '#3b82f6',
  },
  {
    title: 'Tỷ lệ lấp đầy sức chứa',
    value: '84.2%',
    unit: 'dung lượng',
    growth: '+3.1%',
    isPositive: true,
    icon: ShopOutlined,
    color: '#10b981',
  },
  {
    title: 'Đơn nhập kho hôm nay',
    value: '128',
    unit: 'chuyến xe',
    growth: '-4.2%',
    isPositive: false,
    icon: InboxOutlined,
    color: '#f59e0b',
  },
  {
    title: 'Đơn xuất kho hôm nay',
    value: '246',
    unit: 'đơn hàng',
    growth: '+18.4%',
    isPositive: true,
    icon: ArrowUpOutlined,
    color: '#8b5cf6',
  },
];

const movementTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Nhập kho (Inbound)', 'Xuất kho (Outbound)'],
    textStyle: { color: isDark.value ? '#a1a1a6' : '#4b5563' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    axisLine: { lineStyle: { color: isDark.value ? '#38383b' : '#e5e7eb' } },
    axisLabel: { color: isDark.value ? '#a1a1a6' : '#6b7280' },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: isDark.value ? '#262629' : '#f3f4f6' } },
    axisLabel: { color: isDark.value ? '#a1a1a6' : '#6b7280' },
  },
  series: [
    {
      name: 'Nhập kho (Inbound)',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 190, 230, 210],
      itemStyle: { color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.0)' },
          ],
        },
      },
    },
    {
      name: 'Xuất kho (Outbound)',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310],
      itemStyle: { color: '#10b981' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
          ],
        },
      },
    },
  ],
}));

const categoryDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: { color: isDark.value ? '#a1a1a6' : '#4b5563' },
  },
  series: [
    {
      name: 'Cơ cấu tồn kho',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: isDark.value ? '#0c0c0c' : '#fff',
        borderWidth: 2,
      },
      label: { show: false },
      data: [
        { value: 1048, name: 'Vật liệu xây dựng', itemStyle: { color: '#3b82f6' } },
        { value: 735, name: 'Điện & Điện tử', itemStyle: { color: '#10b981' } },
        { value: 580, name: 'Phụ tùng cơ khí', itemStyle: { color: '#f59e0b' } },
        { value: 484, name: 'Hóa chất bao bì', itemStyle: { color: '#8b5cf6' } },
        { value: 300, name: 'Khác', itemStyle: { color: '#ec4899' } },
      ],
    },
  ],
}));

const recentMovements = [
  { id: '1', code: 'NK-2026-0091', type: 'Nhập kho', warehouse: 'Kho Tổng TP.HCM', items: '24 SKUs', qty: '1,400', status: 'Hoàn tất' },
  { id: '2', code: 'XK-2026-0412', type: 'Xuất kho', warehouse: 'Kho Bình Dương', items: '8 SKUs', qty: '650', status: 'Đang giao' },
  { id: '3', code: 'CK-2026-0033', type: 'Chuyển kho', warehouse: 'Kho A ➔ Kho C', items: '15 SKUs', qty: '320', status: 'Đang chuyển' },
  { id: '4', code: 'NK-2026-0092', type: 'Nhập kho', warehouse: 'Kho Đà Nẵng', items: '40 SKUs', qty: '2,100', status: 'Hoàn tất' },
];

const movementColumns = [
  { title: 'Mã chứng từ', dataIndex: 'code', key: 'code' },
  { title: 'Loại nghiệp vụ', dataIndex: 'type', key: 'type' },
  { title: 'Kho / Tuyến', dataIndex: 'warehouse', key: 'warehouse' },
  { title: 'Số SKU', dataIndex: 'items', key: 'items' },
  { title: 'Tổng số lượng', dataIndex: 'qty', key: 'qty' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
];
</script>

<template>
  <div class="dashboard-page">
    <!-- Welcome Top Banner -->
    <div class="dashboard-banner flex items-center justify-between">
      <div>
        <h2 class="banner-title font-bold text-xl">Trung tâm chỉ huy & Điều hành Kho Vận (WMS)</h2>
        <p class="banner-subtitle text-sm text-muted-foreground">
          Cập nhật tình trạng kho bãi, tồn kho thời gian thực và lịch trình nhập xuất.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <a-button type="primary">
          <PlusOutlined /> Tạo lệnh xuất nhập
        </a-button>
        <a-button>
          <SyncOutlined /> Đồng bộ dữ liệu
        </a-button>
      </div>
    </div>

    <!-- 4 KPI Cards Grid -->
    <div class="kpi-grid">
      <a-card v-for="kpi in kpis" :key="kpi.title" :bordered="false" class="kpi-card">
        <div class="flex items-center justify-between">
          <div class="kpi-content">
            <div class="kpi-title text-xs text-muted-foreground">{{ kpi.title }}</div>
            <div class="kpi-value text-2xl font-bold mt-1">{{ kpi.value }}</div>
            <div class="kpi-meta text-xs mt-1 flex items-center gap-1">
              <span :style="{ color: kpi.isPositive ? '#10b981' : '#ef4444' }" class="font-semibold">
                {{ kpi.growth }}
              </span>
              <span class="text-muted-foreground">so với tuần trước</span>
            </div>
          </div>
          <div class="kpi-icon-wrap flex items-center justify-center" :style="{ background: `${kpi.color}15`, color: kpi.color }">
            <component :is="kpi.icon" style="font-size: 22px" />
          </div>
        </div>
      </a-card>
    </div>

    <!-- Charts Grid (2 columns) -->
    <div class="charts-grid mt-4">
      <a-card title="Biểu đồ Nhập - Xuất kho 7 ngày gần nhất" :bordered="false" class="chart-card">
        <div style="height: 320px">
          <v-chart :option="movementTrendOption" autoresize />
        </div>
      </a-card>

      <a-card title="Phân bổ Tồn kho theo Ngành hàng" :bordered="false" class="chart-card">
        <div style="height: 320px">
          <v-chart :option="categoryDistributionOption" autoresize />
        </div>
      </a-card>
    </div>

    <!-- Recent Movements Table -->
    <a-card title="Nghiệp vụ xuất nhập kho vừa phát sinh" :bordered="false" class="mt-4">
      <a-table
        :columns="movementColumns"
        :data-source="recentMovements"
        :pagination="false"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code'">
            <span class="font-bold text-primary cursor-pointer">{{ record.code }}</span>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="record.type === 'Nhập kho' ? 'blue' : record.type === 'Xuất kho' ? 'green' : 'orange'">
              {{ record.type }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="record.status === 'Hoàn tất' ? 'success' : 'processing'"
              :text="record.status"
            />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-banner {
  padding: 16px 20px;
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.banner-title {
  margin: 0 0 4px 0;
  color: var(--foreground);
}

.banner-subtitle {
  margin: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 14px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
