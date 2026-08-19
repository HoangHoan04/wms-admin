const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export type AuthUser = {
  username: string;
  name: string;
  email: string;
};

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** MOCK LOGIN: admin / 123 */
export function mockLogin(
  username: string,
  password: string,
): { ok: true } | { ok: false; message: string } {
  // TODO: gọi API auth thật — tạm comment khi dùng mock
  // await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })

  if (username.trim() === "admin" && password === "123") {
    const user: AuthUser = {
      username: "admin",
      name: "Admin",
      email: "admin@example.com",
    };
    localStorage.setItem(TOKEN_KEY, "mock-access-token");
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { ok: true };
  }

  return { ok: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
