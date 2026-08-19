<script setup lang="ts">
import { AUTH_ROUTES, ROUTES_CONFIG } from '@/common/constants/routes';
import { useAuthStore } from '@/stores/auth.store';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const username = ref('admin');
const password = ref('123');
const rememberMe = ref(true);
const loading = ref(false);
const error = ref('');
const contactOpen = ref(false);

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace(ROUTES_CONFIG.HOME.path);
  }
});

async function onLogin() {
  error.value = '';
  if (!username.value.trim() || !password.value.trim()) {
    error.value = t('auth.fillAllFields', 'Vui lòng điền đầy đủ thông tin đăng nhập.');
    return;
  }

  loading.value = true;
  try {
    const result = await authStore.mockLogin({
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });

    if (result.ok) {
      message.success(t('auth.loginSuccess', 'Đăng nhập thành công!'));
      router.replace(ROUTES_CONFIG.HOME.path);
    } else {
      error.value = result.message;
    }
  } catch (err: any) {
    error.value = err.message || 'Đăng nhập thất bại';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-welcome">
      <h1 class="login-title">{{ t('auth.signInTitle', 'Đăng nhập') }}</h1>
      <p class="login-subtitle">{{ t('auth.signInSubtitle', 'Vui lòng nhập thông tin tài khoản để tiếp tục') }}</p>
    </div>

    <form class="login-form" @submit.prevent="onLogin">
      <div v-if="error" class="login-alert">
        <span>⚠</span>
        <span>{{ error }}</span>
      </div>

      <div class="login-field">
        <label class="login-label" for="username">{{ t('auth.username', 'Tên đăng nhập') }}</label>
        <a-input
          id="username"
          v-model:value="username"
          size="large"
          placeholder="admin"
          allow-clear
          class="custom-antd-input"
        >
          <template #prefix>
            <UserOutlined style="color: var(--muted-foreground); font-size: 16px; margin-right: 4px" />
          </template>
        </a-input>
      </div>

      <div class="login-field">
        <label class="login-label" for="password">{{ t('auth.password', 'Mật khẩu') }}</label>
        <a-input-password
          id="password"
          v-model:value="password"
          size="large"
          placeholder="123"
          class="custom-antd-input"
        >
          <template #prefix>
            <LockOutlined style="color: var(--muted-foreground); font-size: 16px; margin-right: 4px" />
          </template>
        </a-input-password>
      </div>

      <div class="login-options flex items-center justify-between">
        <label
          class="login-remember flex items-center gap-2 cursor-pointer select-none"
          :class="{ checked: rememberMe }"
          @click.prevent="rememberMe = !rememberMe"
        >
          <span class="login-checkbox">{{ rememberMe ? '✓' : '' }}</span>
          <span>{{ t('auth.rememberMe', 'Ghi nhớ đăng nhập') }}</span>
        </label>
        <router-link class="login-forgot" :to="AUTH_ROUTES.FORGOT_PASSWORD">
          {{ t('auth.forgotPassword', 'Quên mật khẩu?') }}
        </router-link>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="loading"
        class="auth-submit-btn"
      >
        <span>{{ loading ? t('auth.signingIn', 'Đang đăng nhập...') : t('auth.signIn', 'Đăng nhập') }}</span>
      </a-button>

      <div class="login-footer-text">
        <span>{{ t('auth.noAccount', 'Chưa có tài khoản?') }}</span>
        <button type="button" class="create-account-link" @click="contactOpen = true">
          {{ t('auth.requestAccount', 'Yêu cầu cấp tài khoản') }}
        </button>
      </div>
    </form>

    <!-- Modal Liên hệ Admin / IT -->
    <a-modal
      v-model:open="contactOpen"
      title="Yêu cầu cấp tài khoản hệ thống WMS"
      :footer="null"
      centered
    >
      <div style="padding: 12px 0">
        <p style="color: var(--muted-foreground); font-size: 13px; line-height: 1.6; margin-bottom: 16px">
          Hệ thống Quản trị Kho Vận <strong>WMS Smart</strong> chỉ dành cho nhân sự nội bộ được cấp quyền. Vui lòng liên hệ Bộ phận IT hoặc Quản lý Kho để được hỗ trợ cấp tài khoản.
        </p>
        <div style="display: grid; gap: 12px; margin-bottom: 16px">
          <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px">
            <div style="font-weight: 600">Bộ phận Hỗ trợ Kỹ thuật & IT</div>
            <div style="color: var(--primary); font-size: 12px; margin: 4px 0">Hotline: (028) 8888 9999</div>
            <div style="font-size: 12px">Email: it.support@wms-smart.vn</div>
          </div>
          <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px">
            <div style="font-weight: 600">Ban Điều Hành Kho Vận</div>
            <div style="color: var(--primary); font-size: 12px; margin: 4px 0">Hotline: (028) 7777 6666</div>
            <div style="font-size: 12px">Email: warehouse.admin@wms-smart.vn</div>
          </div>
        </div>
        <a-button type="primary" block @click="contactOpen = false">
          Đã hiểu & Đóng
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="scss">
.login-wrapper {
  width: 100%;
}

.login-welcome {
  margin-bottom: 24px;

  .login-title {
    font-size: 26px;
    font-weight: 800;
    color: var(--foreground);
    margin: 0 0 6px 0;
    letter-spacing: -0.5px;
  }

  .login-subtitle {
    font-size: 14px;
    color: var(--muted-foreground);
    margin: 0;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;

  .login-alert {
    padding: 10px 14px;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: var(--radius-md);
    color: #ef4444;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .login-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--foreground);
    }
  }

  .login-options {
    font-size: 13px;

    .login-remember {
      color: var(--foreground);

      .login-checkbox {
        width: 18px;
        height: 18px;
        border: 1.5px solid var(--border);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        background: var(--background);
        transition: all 0.2s ease;
      }

      &.checked .login-checkbox {
        background: var(--primary);
        border-color: var(--primary);
        color: #ffffff;
      }
    }

    .login-forgot {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .auth-submit-btn {
    height: 46px;
    font-size: 15px;
    font-weight: 600;
    border-radius: var(--radius-md);
    margin-top: 6px;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  }

  .login-footer-text {
    text-align: center;
    font-size: 13px;
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;

    .create-account-link {
      background: none;
      border: none;
      padding: 0;
      color: var(--primary);
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
