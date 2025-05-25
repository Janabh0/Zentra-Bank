// set up for axios
import axios from "axios";
import { getToken } from "./storage";

const instance = axios.create({
  baseURL: "https://react-bank-project.eapi.joincoded.com/",
});

//authorization

instance.interceptors.request.use(async (req) => {
  const token = await getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});
export default instance;
