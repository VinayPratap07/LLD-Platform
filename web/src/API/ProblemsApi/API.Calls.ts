import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/problems",
});

export const getProblems = async () => {
  const res = await api.get("/getProblems", {
    withCredentials: true,
  });

  return res.data;
};

export const getOneProblem = async (id: string) => {
  const res = await api.get(`/getProblemById/${id}`, {
    withCredentials: true,
  });

  return res.data;
};
