<script setup lang="ts">
import { DownloadOutlined, FileExcelOutlined, InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import * as XLSX from 'xlsx';

withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    templateUrl?: string;
    sampleColumns?: { title: string; dataIndex: string }[];
  }>(),
  {
    title: 'Nhập dữ liệu từ tệp Excel',
    sampleColumns: () => [
      { title: 'Mã SKU', dataIndex: 'sku' },
      { title: 'Tên sản phẩm', dataIndex: 'productName' },
      { title: 'Số lượng', dataIndex: 'quantity' },
      { title: 'Đơn vị', dataIndex: 'unit' },
    ],
  },
);

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void;
  (e: 'submit', data: any[]): void;
}>();

const fileList = ref<any[]>([]);
const previewData = ref<any[]>([]);
const previewColumns = ref<any[]>([]);

function handleClose() {
  fileList.value = [];
  previewData.value = [];
  emit('update:open', false);
}

function handleFileChange(info: any) {
  const file = info.file;
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length > 0) {
        const headers = json[0] as string[];
        previewColumns.value = headers.map((h, i) => ({
          title: h || `Cột ${i + 1}`,
          dataIndex: `col_${i}`,
          key: `col_${i}`,
        }));

        previewData.value = json.slice(1, 10).map((row, rowIdx) => {
          const rowObj: Record<string, any> = { key: rowIdx };
          row.forEach((cell: any, cellIdx: number) => {
            rowObj[`col_${cellIdx}`] = cell;
          });
          return rowObj;
        });

        message.success(`Đã đọc ${json.length - 1} dòng dữ liệu từ file.`);
      }
    } catch (err: any) {
      message.error(`Lỗi đọc file Excel: ${err.message}`);
    }
  };

  reader.readAsArrayBuffer(file);
}

function onSubmit() {
  if (previewData.value.length === 0) {
    message.warning('Vui lòng chọn file Excel hợp lệ trước.');
    return;
  }
  emit('submit', previewData.value);
  handleClose();
}
</script>

<template>
  <a-modal
    :open="open"
    :title="title"
    width="720px"
    @cancel="handleClose"
    @ok="onSubmit"
  >
    <div class="excel-modal-body">
      <!-- Template Download Banner -->
      <div class="download-banner flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FileExcelOutlined style="color: #10b981; font-size: 20px" />
          <span class="text-sm">Chưa có file mẫu chuẩn của hệ thống?</span>
        </div>
        <a-button type="link" size="small">
          <DownloadOutlined /> Tải file mẫu (.xlsx)
        </a-button>
      </div>

      <!-- Upload Drop Area -->
      <a-upload-dragger
        name="file"
        :multiple="false"
        :show-upload-list="false"
        :before-upload="() => false"
        accept=".xlsx, .xls, .csv"
        class="excel-dragger"
        @change="handleFileChange"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined style="color: var(--primary)" />
        </p>
        <p class="ant-upload-text">Nhấp hoặc kéo thả file Excel vào khu vực này để tải lên</p>
        <p class="ant-upload-hint">Hỗ trợ các định dạng .xlsx, .xls, .csv dung lượng tối đa 10MB</p>
      </a-upload-dragger>

      <!-- Preview Table -->
      <div v-if="previewData.length > 0" class="preview-section">
        <div class="font-bold text-sm mb-2">Xem trước dữ liệu (9 dòng đầu tiên):</div>
        <a-table
          :columns="previewColumns"
          :data-source="previewData"
          :pagination="false"
          size="small"
          :scroll="{ x: 500, y: 220 }"
        />
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.excel-modal-body {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.download-banner {
  padding: 10px 16px;
  background: var(--muted);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}
.excel-dragger {
  background: var(--background) !important;
}
.preview-section {
  margin-top: 8px;
}
</style>
