import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axiosInstance";
import socket from "../../utils/socket";
import SearchList from "./SearchList";

const SearchDropdown = ({
  results,
  isOpen,
  userId,
  dropdownRef,
  setOpenDropdown,
  setSearchInput,
}) => {
  const queryClient = useQueryClient();
  if (!isOpen) return null;

  const handleFollow = async (id) => {
    try {
      await axiosInstance.put(`/user/follow/${id}`);

      // find the user from the search results
      const followedUser = results.find((u) => u._id === id);
      if (!followedUser) return;

      queryClient.setQueryData(
        ["connections", userId, "following"],
        (oldData = []) => {
          const alreadyExists = oldData.some((u) => u._id === id);
          return alreadyExists ? oldData : [...oldData, followedUser];
        }
      );

      setOpenDropdown(false);
      setSearchInput("");
    } catch (error) {
      console.error("Follow failed:", error);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await axiosInstance.put(`/user/unfollow/${id}`);

      queryClient.setQueryData(
        ["connections", userId, "following"],
        (oldData = []) => oldData.filter((u) => u._id !== id)
      );

      setOpenDropdown(false);
      setSearchInput("");
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  };

  const handleMessage = (id) => {
    try {
      socket.emit("redirectConvo", {
        sender: userId,
        receiver: id,
      });

      // Close the dropdown and clear search
      setOpenDropdown(false);
      setSearchInput("");

      // Update the cache to ensure the conversation appears immediately
      queryClient.invalidateQueries(["conversations", userId]);
    } catch (error) {
      console.error("Error initiating conversation:", error);
    }
  };

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: "absolute",
        top: "3.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "45rem",
        backgroundColor: "#121212",
        borderRadius: "10px",
        border: "1px solid #323232",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {results.length === 0 ? (
        <Typography p={2} textAlign="center" color="gray">
          No results found
        </Typography>
      ) : (
        results.map((res) => (
          <SearchList
            key={res._id}
            res={res}
            handleFollow={handleFollow}
            handleMessage={handleMessage}
            handleUnfollow={handleUnfollow}
          />
        ))
      )}
    </Box>
  );
};

export default SearchDropdown;
