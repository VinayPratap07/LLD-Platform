import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/submission",
});

export const getAllSubmissons = async () => {
  const res = await api.get("/submissions", {
    withCredentials: true,
  });

  return res.data;
};

export const getEvalutaion = async (id: string) => {
  const res = await api.get(`/evaluation/${id}`, { withCredentials: true });

  return res.data;
};

export const submitUserSolution = async (data: {
  content: string;
  problemId: string;
  language?: string;
  contentType: string;
}) => {
  const res = await api.post("/submitSolution", data, {
    withCredentials: true,
  });

  return res.data;
};
