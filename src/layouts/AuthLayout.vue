<script setup lang="ts">
import LanguageSelect from '@/components/layout/LanguageSelect.vue';
import ThemeToggle from '@/components/layout/ThemeToggle.vue';
</script>

<template>
  <div class="auth-layout">
    <!-- Top-right Quick Controls -->
    <div class="auth-top-actions flex items-center gap-3">
      <LanguageSelect />
      <ThemeToggle />
    </div>

    <!-- Left Decorative Glass Section -->
    <div class="auth-bg">
      <div class="auth-blob auth-blob--1" />
      <div class="auth-blob auth-blob--2" />
      <div class="auth-blob auth-blob--3" />
      <div class="auth-blob auth-blob--4" />
      <div class="auth-grid" />

      <div class="auth-glass-card">
        <h2 class="glass-title">Smart & Seamless Warehouse Management System</h2>
        <div class="glass-graphic-container">
          <div class="graphic-shape shape-sphere" />
          <div class="graphic-shape shape-donut" />
          <div class="graphic-shape shape-pill" />
        </div>
        <p class="glass-desc">
          Tối ưu hóa không gian lưu trữ, tự động hóa quy trình nhập xuất và kiểm soát tồn kho thời gian thực.
        </p>
      </div>
    </div>

    <!-- Right Content Section -->
    <div class="auth-content">
      <div class="auth-header flex items-center gap-3">
        <div class="auth-logo flex items-center justify-center">W</div>
        <span class="auth-brand">WMS SMART</span>
      </div>

      <div class="auth-card">
        <router-view />
      </div>

      <p class="auth-copy">&copy; 2026 WMS Smart Enterprise. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--background);
  color: var(--foreground);
  position: relative;
  transition: background-color 0.3s ease, color 0.3s ease;

  .auth-top-actions {
    position: absolute;
    top: 20px;
    right: 24px;
    z-index: 50;
    background: var(--background-card);
    padding: 4px 10px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .auth-bg {
    position: relative;
    flex: 1.2;
    background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 40px;
    z-index: 1;

    @media (max-width: 992px) {
      display: none;
    }

    .auth-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      mix-blend-mode: screen;
      animation: float-blob 18s infinite alternate ease-in-out;

      &--1 {
        top: -10%;
        left: -10%;
        width: 500px;
        height: 500px;
        background: #3b82f6;
      }

      &--2 {
        bottom: -10%;
        right: -10%;
        width: 600px;
        height: 600px;
        background: #1d4ed8;
        animation-delay: -5s;
      }

      &--3 {
        top: 30%;
        right: 10%;
        width: 300px;
        height: 300px;
        background: #60a5fa;
        animation-delay: -10s;
      }

      &--4 {
        bottom: 20%;
        left: 10%;
        width: 400px;
        height: 400px;
        background: #2563eb;
        animation-delay: -15s;
      }
    }

    .auth-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 32px 32px;
      opacity: 0.6;
      z-index: 2;
    }

    .auth-glass-card {
      position: relative;
      z-index: 5;
      width: 100%;
      max-width: 480px;
      padding: 44px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;

      .glass-title {
        color: #ffffff;
        font-size: 24px;
        font-weight: 700;
        line-height: 1.4;
        margin: 0;
      }

      .glass-desc {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }

      .glass-graphic-container {
        position: relative;
        width: 240px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;

        .graphic-shape {
          position: absolute;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
          animation: float-shape 6s infinite ease-in-out;
        }

        .shape-sphere {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #eff6ff 0%, #3b82f6 50%, #1e3a8a 100%);
          z-index: 3;
          animation-duration: 5s;
        }

        .shape-donut {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          border: 20px solid #93c5fd;
          background: transparent;
          z-index: 2;
          transform: rotate(45deg);
          animation-duration: 7s;
          animation-delay: -2s;
          top: 15%;
          left: 10%;
        }

        .shape-pill {
          width: 96px;
          height: 38px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.15) 100%);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          z-index: 4;
          transform: rotate(-25deg);
          animation-duration: 9s;
          animation-delay: -4s;
          bottom: 10%;
          right: 15%;
        }
      }
    }
  }

  .auth-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 60px 32px 32px 32px;
    background: var(--background);
    z-index: 10;
    position: relative;
    transition: background-color 0.3s ease;

    @media (max-width: 992px) {
      flex: 1;
      width: 100%;
      justify-content: center;
      gap: 32px;
    }
  }

  .auth-header {
    align-self: center;
    margin-bottom: 8px;

    .auth-logo {
      width: 44px;
      height: 44px;
      background: var(--primary);
      color: #fff;
      border-radius: 12px;
      font-size: 22px;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
    }

    .auth-brand {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: var(--foreground);
    }
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    margin: auto 0;
    padding: 16px 0;
  }

  .auth-copy {
    font-size: 13px;
    color: var(--muted-foreground);
    margin: 0;
    text-align: center;
  }
}

@keyframes float-blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(25px, -40px) scale(1.05); }
  100% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes float-shape {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(8deg); }
}
</style>
