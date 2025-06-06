import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://echo-backend-4am1.onrender.com", // Your backend URL
  withCredentials: true, // This will include cookies in all requests
});

export default axiosInstance;
