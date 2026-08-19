<script setup lang="ts">
import { getUser, logout } from "@/utils/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = computed(() => getUser()?.username || "admin");

function onLogout() {
  logout();
  router.replace("/auth/login");
}
</script>

<template>
  <div class="home-shell">
    <div class="home-card">
      <h1>Admin Dashboard (Vue)</h1>
      <p>
        Đã đăng nhập: <strong>{{ username }}</strong>
      </p>
      <button type="button" class="ghost" @click="onLogout">Đăng xuất</button>
    </div>
  </div>
</template>
