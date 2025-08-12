import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../axiosInstance";
import useUser from "../../hooks/useUser";
import socket from "../../utils/socket";

export default function HoverCard({ id }) {
  const { data: currentUser } = useUser();
  const queryClient = useQueryClient();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/basic/${id}`);
        setTargetUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleMessageClick = () => {
    try {
      socket.emit("redirectConvo", {
        sender: currentUser._id,
        receiver: id,
      });

      // Invalidate the conversations query to ensure immediate update
      queryClient.invalidateQueries(["conversations", currentUser._id]);
    } catch (error) {
      console.error("Error initiating conversation:", error);
    }
  };

  if (!targetUser) return null; // Avoid rendering before data is loaded

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "stretch",
        background: "#11111b",
        color: "whitesmoke",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 4,
      }}
    >
      {/* Info Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          flex: 1,
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* Followers */}
            <Box textAlign="center">
              <Typography variant="subtitle2" fontWeight={700}>
                Followers
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {targetUser.follower.length}
              </Typography>
            </Box>

            {/* Following */}
            <Box textAlign="center">
              <Typography variant="subtitle2" fontWeight={700}>
                Following
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {targetUser.following.length}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Buttons */}
        <Box display="flex" justifyContent="center" mt={2}>
          <ButtonGroup size="small" variant="outlined">
            <Button
              endIcon={<SendIcon />}
              onClick={handleMessageClick}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                  borderColor: "primary.main",
                },
              }}
            >
              Message
            </Button>
            <Button
              endIcon={<PersonAddRoundedIcon />}
              sx={{
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "#fff",
                  borderColor: "success.main",
                },
              }}
            >
              Follow
            </Button>
          </ButtonGroup>
        </Box>
      </Box>

      {/* Profile Photo */}
      <CardMedia
        component="img"
        sx={{
          width: 140,
          cursor: "pointer",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
        image={targetUser.profileImage}
        alt={targetUser.username}
      />
    </Card>
  );
}
