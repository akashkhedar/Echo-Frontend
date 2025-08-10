import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/about");
      console.log(res);
      return res.data;
    },
    staleTime: 60_000,
  });
};

export default useUser;
