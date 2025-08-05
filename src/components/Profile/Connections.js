// FriendsPage.jsx
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import useConnections from "../../hooks/useConnections";
import UserList from "./UserList";
import LoadingFriends from "./LoadingFriends";

const FriendsPage = ({ path }) => {
  const userId = useSelector((state) => state.user._id);
  const isFollowersView = path === "/profile/followers";
  const type = isFollowersView ? "followers" : "following";

  const { data: users = [], isLoading, isError } = useConnections(userId, type);

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

  const renderUserCards = (list) =>
    list.map((user) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
        <UserList
          user={user}
          {...(isFollowersView
            ? { setFollowers: () => {} }
            : { setFollowing: () => {} })}
        />
      </Grid>
    ));

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

export default FriendsPage;
