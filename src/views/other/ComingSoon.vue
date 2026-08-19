<script setup lang="ts">
import { RocketOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="coming-soon-page flex items-center justify-center">
    <a-result
      title="Tính năng đang được phát triển"
      sub-title="Phân hệ này đang được hoàn thiện và sẽ sớm ra mắt trong bản cập nhật tiếp theo."
    >
      <template #icon>
        <RocketOutlined style="color: var(--primary); font-size: 64px" />
      </template>
      <template #extra>
        <a-button type="primary" size="large" @click="router.push('/')">
          Quay lại Trang chủ
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.coming-soon-page {
  min-height: 400px;
  padding: 40px 0;
}
</style>
