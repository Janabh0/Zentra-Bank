export interface User {
  id: string;
  username: string;
  image?: string;
  balance?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    image?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}
