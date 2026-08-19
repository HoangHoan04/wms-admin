<script setup lang="ts">
import { AUTH_ROUTES } from '@/common/constants/routes';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const loading = ref(false);
const sent = ref(false);

function onSubmit() {
  if (!email.value.trim()) {
    message.warning('Vui lòng nhập địa chỉ email hợp lệ');
    return;
  }
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    sent.value = true;
    message.success('Đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn.');
  }, 500);
}
</script>

<template>
  <div class="forgot-page">
    <div class="login-welcome">
      <h1 class="login-title">Khôi phục mật khẩu</h1>
      <p class="login-subtitle">Nhập email đã đăng ký để nhận mã liên kết đặt lại mật khẩu</p>
    </div>

    <div v-if="sent" class="sent-box">
      <a-result
        status="success"
        title="Email đã được gửi!"
        sub-title="Vui lòng kiểm tra hộp thư đến để tiếp tục các bước đặt lại mật khẩu."
      >
        <template #extra>
          <a-button type="primary" size="large" @click="router.push(AUTH_ROUTES.LOGIN)">
            Quay lại Đăng nhập
          </a-button>
        </template>
      </a-result>
    </div>

    <form v-else class="login-form" @submit.prevent="onSubmit">
      <div class="login-field">
        <label class="login-label" for="email">Địa chỉ Email</label>
        <a-input
          id="email"
          v-model:value="email"
          size="large"
          type="email"
          placeholder="name@wms-smart.vn"
          allow-clear
          class="custom-antd-input"
        >
          <template #prefix>
            <MailOutlined style="color: var(--muted-foreground); font-size: 16px; margin-right: 4px" />
          </template>
        </a-input>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        size="large"
        block
        :loading="loading"
        class="auth-submit-btn"
      >
        Gửi liên kết khôi phục
      </a-button>

      <div class="login-footer-text">
        <router-link :to="AUTH_ROUTES.LOGIN" class="create-account-link flex items-center justify-center gap-1">
          <ArrowLeftOutlined /> Quay lại Đăng nhập
        </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.forgot-page {
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
    margin-top: 8px;

    .create-account-link {
      color: var(--primary);
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.sent-box {
  background: var(--background-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
}
</style>
