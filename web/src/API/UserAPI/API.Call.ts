import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/user",
});

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/register", data, {
    withCredentials: true,
  });

  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/login", data, {
    withCredentials: true,
  });

  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/me", { withCredentials: true });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get("/logout", { withCredentials: true });

  return res.data;
};
