<script setup lang="ts">
import { useFullscreen } from '@/composables/useFullscreen';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';

const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div class="fullscreen-btn cursor-pointer flex items-center justify-center" @click="toggle">
    <FullscreenExitOutlined v-if="isFullscreen" />
    <FullscreenOutlined v-else />
  </div>
</template>

<style scoped>
.fullscreen-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-size: 17px;
  color: var(--foreground);
}
.fullscreen-btn:hover {
  background: var(--muted);
}
</style>
