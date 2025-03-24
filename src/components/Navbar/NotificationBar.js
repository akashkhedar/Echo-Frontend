import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import * as React from "react";
import NotificationBlock from "./NotificationBlock";
import NoNotification from "./NoNotification";

const notifications = [
  {
    id: 1,
    title: "New Message",
    message: "You have a new message from John Doe.",
    timestamp: "2024-12-31T12:30:00Z",
    type: "message",
    isRead: false,
  },
  {
    id: 2,
    title: "Order Update",
    message: "Your order #1234 has been shipped and is on its way!",
    timestamp: "2024-12-30T15:00:00Z",
    type: "order",
    isRead: true,
  },
  {
    id: 3,
    title: "Reminder",
    message: "Don't forget to complete your profile to get better matches.",
    timestamp: "2024-12-29T08:45:00Z",
    type: "reminder",
    isRead: false,
  },
  {
    id: 4,
    title: "System Alert",
    message: "Your password will expire in 3 days. Update it now.",
    timestamp: "2024-12-28T10:20:00Z",
    type: "alert",
    isRead: false,
  },
  {
    id: 5,
    title: "Promotion",
    message: "Get 20% off your next purchase. Offer valid till Jan 5!",
    timestamp: "2024-12-27T14:10:00Z",
    type: "promotion",
    isRead: true,
  },
  {
    id: 6,
    title: "Friend Request",
    message: "Alex Smith sent you a friend request.",
    timestamp: "2024-12-26T16:35:00Z",
    type: "social",
    isRead: false,
  },
  {
    id: 7,
    title: "Payment Received",
    message: "We have received your payment of $250. Thank you!",
    timestamp: "2024-12-25T09:50:00Z",
    type: "payment",
    isRead: true,
  },
  {
    id: 8,
    title: "Weekly Update",
    message: "Here's what you missed this week: 5 new connections, 2 messages.",
    timestamp: "2024-12-24T18:15:00Z",
    type: "update",
    isRead: false,
  },
  {
    id: 9,
    title: "Event Reminder",
    message: "Your meeting with the project team starts in 1 hour.",
    timestamp: "2024-12-24T07:30:00Z",
    type: "event",
    isRead: false,
  },
  {
    id: 10,
    title: "New Comment",
    message: "Sophia commented on your post: 'Great work on this!'",
    timestamp: "2024-12-23T21:00:00Z",
    type: "comment",
    isRead: true,
  },
];
const NotificationsBar = ({ isOpen, toggleDrawer }) => {
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "30rem" },
          top: "4rem",
          backgroundImage: "linear-gradient(#1E1E2F, #121212)", // Dark theme background
          color: "whitesmoke",
          borderLeft: "1px solid #333",
          borderTop: "1px solid #333",
          borderTopLeftRadius: "10px",
          zIndex: 9999,
        },
      }}
      variant="persistent"
      anchor="right"
      open={isOpen}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.7rem 1rem",
          backgroundColor: "linear-gradient(to right, #000000, #130F40 )",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: "1.5rem", color: "whitesmoke" }}
        >
          <IconButton
            onClick={toggleDrawer}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "2rem", color: "whitesmoke" }} />
          </IconButton>
          Notifications
        </Typography>
      </Box>
      <Box
        sx={{
          paddingX: "1.5rem",
          paddingBottom: "3.5rem",
          paddingTop: "1rem",
          maxHeight: "calc(100vh - 4rem)",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#555",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#777",
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationBlock notification={notification} />
          ))
        ) : (
          <NoNotification />
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationsBar;
