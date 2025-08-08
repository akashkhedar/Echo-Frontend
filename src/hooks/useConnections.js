// hooks/useConnections.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

const fetchConnections = async ({ queryKey }) => {
  // eslint-disable-next-line no-unused-vars
  const [, userId, type] = queryKey;
  const endpoint =
    type === "followers" ? `/user/fetch/followers` : `/user/fetch/following`;

  const { data } = await axiosInstance.get(endpoint);
  return data;
};

const useConnections = (userId, type) => {
  return useQuery({
    queryKey: ["connections", userId, type],
    queryFn: fetchConnections,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: !!userId && !!type, // Only run if both values are truthy
  });
};

export default useConnections;
