import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "../api/config";
import apiClient from "../api/client";
import { User } from "../types/auth";

export const TOKEN_KEY = "@auth_token";
export const USER_KEY = "@user_data";

export const authService = {
  async login(username: string, password: string) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      const { token, user } = response.data;
      await this.setToken(token);
      await this.setUser(user);

      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  },

  async register(username: string, password: string, image?: string) {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { token, user } = response.data;
      await this.setToken(token);
      await this.setUser(user);

      return { token, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async getProfile() {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      const user = response.data;
      await this.setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get profile");
    }
  },

  async updateProfile(image: string) {
    try {
      const formData = new FormData();
      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : "image";

      formData.append("image", {
        uri: image,
        name: filename,
        type,
      } as any);

      const response = await apiClient.put(ENDPOINTS.AUTH.PROFILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const user = response.data;
      await this.setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  async getAllUsers() {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.USERS);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get users");
    }
  },

  async getUserById(userId: string) {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.USER(userId));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get user");
    }
  },

  async logout() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};
