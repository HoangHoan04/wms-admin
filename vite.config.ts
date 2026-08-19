import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": srcPath,
      "~": srcPath,
    },
  },
  server: {
    port: 3123,
    open: true,
  },
  build: {
    target: "es2015",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("ant-design-vue") || id.includes("@ant-design/icons-vue")) {
              return "antd-vendor";
            }
            if (id.includes("echarts") || id.includes("vue-echarts")) {
              return "chart-vendor";
            }
            if (id.includes("xlsx")) {
              return "excel-vendor";
            }
            if (
              id.includes("vue") ||
              id.includes("pinia") ||
              id.includes("vue-router") ||
              id.includes("vue-i18n")
            ) {
              return "vue-vendor";
            }
            if (id.includes("axios") || id.includes("dayjs") || id.includes("nprogress")) {
              return "utils-vendor";
            }
          }
        },
      },
    },
  },
});

