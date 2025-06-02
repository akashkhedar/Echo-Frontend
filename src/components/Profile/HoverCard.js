import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SendIcon from "@mui/icons-material/Send";
import { Button, ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import { useSelector } from "react-redux";

export default function HoverCard({
  id,
  username,
  profilePhoto,
  follower,
  following,
}) {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user._id);

  return (
    <Card
      sx={{
        display: "flex",
        zIndex: 100,
        background: "#1E1E2F",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: 2,
          paddingX: 1,
          border: "1px solid slate",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", color: "whitesmoke" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "space-between",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: "900" }}>Followers</Typography>
              <Typography sx={{ fontWeight: "900" }}>{follower}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: "900" }}>Following</Typography>
              <Typography sx={{ fontWeight: "900" }}>{following}</Typography>
            </Box>
          </Box>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <ButtonGroup size="large" aria-label="Small button group">
            <Button
              endIcon={<SendIcon />}
              sx={{
                "&:hover": {
                  background: "blue",
                  color: "white",
                  borderColor: "blue",
                },
              }}
              onClick={() => {
                socket.emit("redirectConvo", {
                  sender: userId,
                  receiver: id,
                });
              }}
            >
              <Typography variant="body2">Message</Typography>
            </Button>
            <Button
              endIcon={<PersonAddRoundedIcon />}
              sx={{
                "&:hover": {
                  background: "green",
                  color: "white",
                  borderColor: "green",
                },
              }}
            >
              <Typography variant="body2">Follow</Typography>
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151, cursor: "pointer" }}
        image={profilePhoto}
        alt={username}
        onClick={() => navigate(`/${username}`)}
      />
    </Card>
  );
}
