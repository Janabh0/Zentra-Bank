// api/auth.ts
import instance from "./axios"; // ✅ fixed path
import { storeToken } from "./storage";

// REGISTER
const signup = async (username: string, password: string, image: string) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", {
    uri: image,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const { data } = await instance.post("auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data.token) {
    await storeToken(data.token);
  }

  return data;
};

// LOGIN
const signin = async (username: string, password: string) => {
  const { data } = await instance.post("auth/login", {
    username,
    password,
  });

  if (data.token) {
    await storeToken(data.token);
  }

  return data;
};

export { signup, signin };
