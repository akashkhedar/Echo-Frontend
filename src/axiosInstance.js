import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Your backend URL
  withCredentials: true, // This will include cookies in all requests
});

export default axiosInstance;
