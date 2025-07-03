import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://api.echo.linkpc.net/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
