export const BASE_URL = "https://react-bank-project.eapi.joincoded.com";
export const API_URL = `${BASE_URL}/mini-project/api`;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    USERS: "/auth/users",
    PROFILE: "/auth/profile",
    USER: (userId: string) => `/auth/user/${userId}`,
  },
  TRANSACTIONS: {
    MY_TRANSACTIONS: "/transactions/my",
    DEPOSIT: "/transactions/deposit",
    WITHDRAW: "/transactions/withdraw",
    TRANSFER: (username: string) => `/transactions/transfer/${username}`,
  },
};
