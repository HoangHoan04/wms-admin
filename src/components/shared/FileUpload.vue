<script setup lang="ts">
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    accept?: string;
    maxSizeMB?: number;
    multiple?: boolean;
  }>(),
  {
    accept: 'image/*,.pdf,.doc,.docx,.xlsx',
    maxSizeMB: 5,
    multiple: false,
  },
);

const emit = defineEmits<{
  (e: 'change', file: File): void;
}>();

const fileList = ref<any[]>([]);

function beforeUpload(file: File) {
  const isLt = file.size / 1024 / 1024 < props.maxSizeMB;
  if (!isLt) {
    message.error(`Dung lượng tệp phải nhỏ hơn ${props.maxSizeMB}MB!`);
    return false;
  }
  emit('change', file);
  return false;
}
</script>

<template>
  <div class="file-upload-wrapper">
    <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :accept="accept"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined style="color: var(--primary); font-size: 32px" />
      </p>
      <p class="ant-upload-text">Nhấp hoặc kéo tệp vào đây để tải lên</p>
      <p class="ant-upload-hint">Dung lượng tối đa {{ maxSizeMB }}MB</p>
    </a-upload-dragger>
  </div>
</template>

<style scoped>
.file-upload-wrapper {
  width: 100%;
}
</style>
