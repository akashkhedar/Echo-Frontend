import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import UserList from "./UserList";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";

const FriendsPage = ({ path }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const userId = useSelector((state) => state.user._id);
  React.useEffect(() => {
    const fetchFollowers = async () => {
      console.log("follower");
      try {
        const res = await axiosInstance.get(`/fetch/followers/${userId}`);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFollowing = async () => {
      console.log("following");
      try {
        const res = await axiosInstance.get(`/fetch/following/${userId}`);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (path === "/profile/followers") {
      fetchFollowers();
    } else {
      fetchFollowing();
    }
  });

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
        {path === "/profile/followers"
          ? followers.map((follower) => <UserList user={follower} />)
          : following.map((following) => <UserList user={following} />)}
      </Grid>
    </Box>
  );
};

export default FriendsPage;
