import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import UserList from "./UserList";
import LoadingFriends from "./LoadingFriends";

const FriendsPage = ({ path }) => {
  const userId = useSelector((state) => state.user._id);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFollowersView = path === "/profile/followers";

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const endpoint = isFollowersView
          ? `/user/fetch/followers/${userId}`
          : `/user/fetch/following/${userId}`;
        const response = await axiosInstance.get(endpoint);
        isFollowersView
          ? setFollowers(response.data)
          : setFollowing(response.data);
      } catch (error) {
        console.error("Error fetching user connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [userId, path, isFollowersView]);

  const renderEmptyMessage = (text) => (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "calc(100vh - 12rem)", // Adjust based on your header/nav height
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

  const renderUserCards = (list, setter) =>
    list.map((user) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
        <UserList
          user={user}
          {...(isFollowersView
            ? { setFollowers: setter }
            : { setFollowing: setter })}
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
        minHeight: "calc(100vh - 50rem)", // Adjust based on the layout
        mb: 2,
      }}
    >
      <Grid container px={1} spacing={2}>
        {loading ? (
          <LoadingFriends />
        ) : isFollowersView ? (
          followers.length > 0 ? (
            renderUserCards(followers, setFollowers)
          ) : (
            renderEmptyMessage("You have no followers!")
          )
        ) : following.length > 0 ? (
          renderUserCards(following, setFollowing)
        ) : (
          renderEmptyMessage("You are not following anyone!")
        )}
      </Grid>
    </Box>
  );
};

export default FriendsPage;
