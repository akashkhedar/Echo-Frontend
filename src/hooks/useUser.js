import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const useUser = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/user/about`);
        return data.data;
      } catch (error) {
        // If unauthorized, try to refresh the token
        if (error.response?.status === 401) {
          try {
            // Make a request that will trigger token refresh
            await axiosInstance.get("/auth/refresh");
            // Retry the original request
            const { data } = await axiosInstance.get(`/user/about`);
            return data.data;
          } catch (refreshError) {
            throw refreshError;
          }
        }
        throw error;
      }
    },
    staleTime: 4 * 60 * 1000, // 4 minutes
    cacheTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

export default useUser;
