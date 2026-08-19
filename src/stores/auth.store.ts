import type { LoginPayload, User } from '@/types/auth.types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const TOKEN_KEY = 'wms_access_token';
const USER_KEY = 'wms_user_info';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(
    (() => {
      try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })(),
  );

  const isAuthenticated = computed(() => !!token.value);
  const userPermissions = computed(() => user.value?.permissions || []);

  function setAuthData(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function mockLogin(payload: LoginPayload): Promise<{ ok: boolean; message: string }> {
    if (payload.username === 'admin' && payload.password === '123') {
      const mockUser: User = {
        id: 'usr_001',
        username: 'admin',
        fullName: 'Nguyễn Quản Trị',
        email: 'admin@wms-smart.vn',
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        department: 'Ban Điều Hành Kho',
      };
      setAuthData('mock_jwt_token_wms_enterprise_2026', mockUser);
      return { ok: true, message: 'Đăng nhập thành công' };
    }

    if (payload.username.trim() && payload.password?.trim()) {
      const mockUser: User = {
        id: 'usr_002',
        username: payload.username,
        fullName: payload.username.toUpperCase(),
        email: `${payload.username}@wms-smart.vn`,
        role: 'WAREHOUSE_OPERATOR',
        permissions: ['warehouse:view', 'inventory:view', 'inventory:import'],
        department: 'Bộ phận Kho Vận',
      };
      setAuthData('mock_jwt_token_user_2026', mockUser);
      return { ok: true, message: 'Đăng nhập thành công' };
    }

    return { ok: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' };
  }

  function hasPermission(permission: string): boolean {
    if (userPermissions.value.includes('*')) return true;
    return userPermissions.value.includes(permission);
  }

  function logout() {
    clearAuth();
  }

  return {
    token,
    user,
    isAuthenticated,
    userPermissions,
    setAuthData,
    clearAuth,
    mockLogin,
    hasPermission,
    logout,
  };
});
