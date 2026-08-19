export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  department?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  username: string;
  password?: string;
  rememberMe?: boolean;
}
