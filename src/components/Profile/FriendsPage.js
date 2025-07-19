import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import { Typography } from "@mui/material";
import LoadingFriends from "./LoadingFriends";

const FriendsPage = ({ path }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (path === "/profile/followers") {
          const res = await axiosInstance.get(
            `/user/fetch/followers/${userId}`
          );
          setFollowers(res.data);
        } else {
          const res = await axiosInstance.get(
            `/user/fetch/following/${userId}`
          );
          setFollowing(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, userId]);

  const renderEmptyState = (message) => (
    <Box
      sx={{
        width: "100%",
        height: "10rem",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" fontWeight={600} color="whitesmoke">
        {message}
      </Typography>
    </Box>
  );

  const isFollowers = path === "/profile/followers";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        marginBottom: 2,
      }}
    >
      <Grid
        container
        spacing={{ xs: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ borderRadius: 2 }}
      >
        {loading ? (
          <LoadingFriends />
        ) : isFollowers ? (
          followers.length > 0 ? (
            followers.map((follower) => (
              <UserList
                key={follower._id}
                user={follower}
                setFollowers={setFollowers}
              />
            ))
          ) : (
            renderEmptyState("You have no followers!")
          )
        ) : following.length > 0 ? (
          following.map((followee) => (
            <UserList
              key={followee._id}
              user={followee}
              setFollowing={setFollowing}
            />
          ))
        ) : (
          renderEmptyState("You are not following anyone!")
        )}
      </Grid>
    </Box>
  );
};

export default FriendsPage;
