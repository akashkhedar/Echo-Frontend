import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import UserList from "./UserList";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import { Typography } from "@mui/material";

const FriendsPage = ({ path }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const userId = useSelector((state) => state.user._id);
  React.useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axiosInstance.get(`/user/fetch/followers/${userId}`);
        setFollowers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const res = await axiosInstance.get(`/user/fetch/following/${userId}`);
        setFollowing(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (path === "/profile/followers") {
      fetchFollowers();
    } else {
      fetchFollowing();
    }
  }, [path, userId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 4,
        backgroundColor: "#1e1e2f",
        borderRadius: 8,
        marginBottom: 2,
      }}
    >
      <Grid
        sx={{
          backgroundColor: "#1e1e2f",
          borderRadius: 2,
        }}
        container
        spacing={{ xs: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {path === "/profile/followers" ? (
          followers && followers.length > 0 ? (
            followers.map((follower) => (
              <UserList
                key={follower._id}
                user={follower}
                setFollowers={setFollowers}
              />
            ))
          ) : (
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
                You have no followers!
              </Typography>
            </Box>
          )
        ) : following && following.length > 0 ? (
          following.map((following) => (
            <UserList
              key={following._id}
              user={following}
              setFollowing={setFollowing}
            />
          ))
        ) : (
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
              You are not following anyone!
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default FriendsPage;
