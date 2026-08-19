<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard.store';
import { computed } from 'vue';

const dashboardStore = useDashboardStore();
const s = computed(() => dashboardStore.settings);
</script>

<template>
  <a-layout-footer
    v-if="s.showFooter"
    class="app-footer flex items-center justify-between"
    :class="{ 'fixed-footer': s.fixedFooter }"
  >
    <div>
      <a :href="s.companyWebsite" target="_blank" rel="noopener noreferrer" class="company-link font-semibold">
        {{ s.companyName }}
      </a>
      <span> &copy; {{ s.copyrightYear }} - WMS Smart Enterprise</span>
    </div>
    <div class="footer-links flex items-center gap-4 text-xs text-muted-foreground">
      <a v-if="s.icpNumber" :href="s.icpLink" target="_blank" rel="noopener noreferrer" class="text-muted-foreground">
        {{ s.icpNumber }}
      </a>
      <span>Phiên bản v2.0.0</span>
      <span>Hỗ trợ kỹ thuật: support@wms-smart.vn</span>
    </div>
  </a-layout-footer>
</template>

<style scoped>
.app-footer {
  height: 50px;
  padding: 0 24px;
  background: var(--background);
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted-foreground);
}
.company-link {
  color: var(--primary);
  text-decoration: none;
}
.company-link:hover {
  text-decoration: underline;
}
.fixed-footer {
  position: sticky;
  bottom: 0;
  z-index: 80;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
</style>
