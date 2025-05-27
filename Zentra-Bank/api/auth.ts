// we will create the functions responsible for calling the auth endpoints

import instance from "./index";
import { storeToken } from "./storage";
import axios from "axios";

interface SignupData {
  username: string;
  password: string;
  image: string;
}

interface UserProfile {
  username: string;
  image: string;
  balance: number;
  id: string;
}

// Register
export const signup = async (
  username: string,
  password: string,
  image: string
) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  if (image) {
    const imageFileName = image.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(imageFileName);
    const imageType = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: image,
      name: imageFileName,
      type: imageType,
    } as any);
  }

  const { data } = await instance.post("auth/register", formData);

  if (data.token) {
    await storeToken(data.token);
  }
  console.log("token: ", data.token);
  return data;
};

// Login
export const signin = async (username: string, password: string) => {
  const { data } = await instance.post("auth/login", {
    username,
    password,
  });

  if (data.token) {
    await storeToken(data.token);
  }

  console.log("token: ", data.token);

  return data;
};

// Get user profile
export const getProfile = async () => {
  const { data } = await instance.get("auth/me");
  return data;
};

// Get all users
export const getAllUsers = async () => {
  const { data } = await instance.get("auth/users");
  return data;
};

// Update profile
export const updateProfile = async (image: string) => {
  const formData = new FormData();

  if (image) {
    const imageFileName = image.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(imageFileName);
    const imageType = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: image,
      name: imageFileName,
      type: imageType,
    } as any);
  }

  const { data } = await instance.put("auth/profile", formData);
  return data;
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const { data } = await instance.get(`auth/user/${userId}`);
  return data;
};

// Logout
export const logout = async () => {
  try {
    await instance.post("auth/logout");
  } catch (error) {
    throw new Error("Error logging out");
  }
};
