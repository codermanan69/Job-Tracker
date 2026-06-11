import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a generic network error (e.g. no internet/server down)
    if (!error.response) {
      toast.error("Network error. Please check your connection.", {
        id: "network-error",
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });
    } else if (error.response.status >= 500) {
      toast.error("Server error. Please try again later.", {
        id: "server-error",
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });
    }
    return Promise.reject(error);
  }
);

export default API;