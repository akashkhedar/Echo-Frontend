import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useConnections from "../../hooks/useConnections";
import UserList from "./UserList";
import LoadingFriends from "./LoadingFriends";
import axiosInstance from "../../axiosInstance";

const Connections = ({ path }) => {
  const queryClient = useQueryClient();
  const userId = useSelector((state) => state.user.userId);
  const isFollowersView = path === "/profile/followers";
  const type = isFollowersView ? "followers" : "following";

  const { data: users = [], isLoading, isError } = useConnections(userId, type);

  const handleRemoveConnection = async (userIdToRemove) => {
    try {
      queryClient.setQueryData(["connections", userId, type], (oldData) =>
        (oldData || []).filter((user) => user._id !== userIdToRemove)
      );

      await axiosInstance.delete(
        isFollowersView
          ? `/user/remove/${userIdToRemove}`
          : `/user/unfollow/${userIdToRemove}`
      );
    } catch (error) {
      queryClient.invalidateQueries(["connections", userId, type]);
      console.error("Failed to remove connection:", error);
    }
  };

  const renderEmptyMessage = (text) => (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "calc(100vh - 12rem)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="whitesmoke">
        {text}
      </Typography>
    </Box>
  );

  const renderUserCards = (list) => {
    if (!Array.isArray(list)) {
      console.error("Expected array but got:", list);
      return renderEmptyMessage("Invalid data format");
    }

    return list.map((user) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
        <UserList
          user={user}
          onRemove={handleRemoveConnection}
          isFollowersView={isFollowersView}
        />
      </Grid>
    ));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "calc(100vh - 50rem)",
        mb: 2,
      }}
    >
      <Grid container px={1} spacing={2}>
        {isLoading ? (
          <LoadingFriends />
        ) : isError ? (
          renderEmptyMessage("Something went wrong!")
        ) : users.length > 0 ? (
          renderUserCards(users)
        ) : isFollowersView ? (
          renderEmptyMessage("You have no followers!")
        ) : (
          renderEmptyMessage("You are not following anyone!")
        )}
      </Grid>
    </Box>
  );
};

export default Connections;
