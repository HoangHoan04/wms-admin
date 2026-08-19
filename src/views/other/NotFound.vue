<script setup lang="ts">
import { HomeOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="error-page flex items-center justify-center">
    <a-result
      status="404"
      title="404"
      sub-title="Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển."
    >
      <template #extra>
        <a-button type="primary" size="large" @click="router.push('/')">
          <HomeOutlined /> Trở về Trang chủ
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 400px;
  padding: 40px 0;
}
</style>
