// hooks/useConnections.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const fetchConnections = async ({ queryKey }) => {
  const [, userId, type] = queryKey;
  const endpoint =
    type === "followers"
      ? `/user/fetch/followers/${userId}`
      : `/user/fetch/following/${userId}`;

  const { data } = await axiosInstance.get(endpoint);
  return data;
};

const useConnections = (userId, type) => {
  return useQuery({
    queryKey: ["connections", userId, type], // eg: ["connections", "user123", "followers"]
    queryFn: fetchConnections,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: !!userId && !!type, // only run if userId and type are available
  });
};

export default useConnections;
