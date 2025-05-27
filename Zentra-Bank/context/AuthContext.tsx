import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { AuthContextType, AuthState } from "../types/auth";
import { authService } from "../services/auth.service";

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return value;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (state.isAuthenticated && inAuthGroup) {
      // Redirect authenticated users to home page if they're on an auth page
      router.replace("/(protected)/(tabs)/(home)");
    } else if (!state.isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated users to login page if they're not on an auth page
      router.replace("/(auth)/Login");
    }
  }, [state.isAuthenticated, segments]);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      const user = await authService.getUser();

      setState({
        isAuthenticated: !!token && !!user,
        user,
        token,
      });
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { token, user } = await authService.login(username, password);
      setState({
        isAuthenticated: true,
        user,
        token,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    username: string,
    password: string,
    image?: string
  ) => {
    try {
      const { token, user } = await authService.register(
        username,
        password,
        image
      );
      setState({
        isAuthenticated: true,
        user,
        token,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
