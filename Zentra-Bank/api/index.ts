// set up for axios
import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({
  baseURL: "https://coded-projects-api.herokuapp.com/mini-project/api",
  headers: {
    Accept: "application/json",
  },
});

//authorization

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set content type based on the data being sent
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
