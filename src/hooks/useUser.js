import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const useUser = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/about`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export default useUser;
