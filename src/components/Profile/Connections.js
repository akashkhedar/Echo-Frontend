import { Box, Grid, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axiosInstance";
import useConnections from "../../hooks/useConnections";
import useUser from "../../hooks/useUser";
import LoadingFriends from "./LoadingFriends";
import UserList from "./UserList";

const Connections = ({ path }) => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const isFollowersView = path === "/profile/followers";
  const type = isFollowersView ? "followers" : "following";

  const {
    data: users = [],
    isLoading,
    isError,
  } = useConnections(user._id, type);

  const handleRemoveConnection = async (userIdToRemove) => {
    try {
      queryClient.setQueryData(["connections", user._id, type], (oldData) =>
        (oldData || []).filter((user) => user._id !== userIdToRemove)
      );

      await axiosInstance.delete(
        isFollowersView
          ? `/user/remove/${userIdToRemove}`
          : `/user/unfollow/${userIdToRemove}`
      );
    } catch (error) {
      queryClient.invalidateQueries(["connections", user._id, type]);
      console.error("Failed to remove connection:", error);
    }
  };

  const renderEmptyMessage = (text) => (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "black",
        mt: 2,
        borderRadius: "8px",
        border: "1px solid #1f1f1fff",
        width: "100%",
        minHeight: "60vh", // 👈 pushes it nicely to center in view
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
        alignItems: "center",
        justifyContent: "center", // 👈 ensures vertical center
        width: "100%",
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
