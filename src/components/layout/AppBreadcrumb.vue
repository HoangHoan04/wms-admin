<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const dashboardStore = useDashboardStore();
const s = computed(() => dashboardStore.settings);

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((r) => r.meta && r.meta.title);
  return matched.map((r) => ({
    title: r.meta.title as string,
    path: r.path,
  }));
});
</script>

<template>
  <div v-if="s.showBreadcrumb && breadcrumbs.length > 0" class="app-breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item href="/">Trang chủ</a-breadcrumb-item>
      <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
        {{ item.title }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<style scoped>
.app-breadcrumb {
  display: flex;
  align-items: center;
  font-size: 13px;
}
</style>
