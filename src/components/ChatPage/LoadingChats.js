import React from "react";
import { Box, Card, CardContent, Skeleton, styled } from "@mui/material";

const ChatSkeletonBubble = styled(Card)(({ align }) => ({
  maxWidth: "60%",
  display: "inline-flex",
  alignSelf: align === "right" ? "flex-end" : "flex-start",
  backgroundColor: align === "right" ? "rgb(43, 9, 48)" : "rgb(11, 9, 48)",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: align === "right" ? "rgb(142, 64, 195)" : "rgb(77, 64, 195)",
  marginBottom: "1.5rem",
}));

const LoadingMessages = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 2,
        pt: 2,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => {
        const align = index % 2 === 0 ? "left" : "right";
        return (
          <ChatSkeletonBubble key={index} align={align}>
            <CardContent
              sx={{
                padding: "6px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Skeleton
                variant="text"
                height={14}
                width={`${50 + Math.random() * 30}%`}
                sx={{ bgcolor: "#444" }}
              />
              <Skeleton
                variant="text"
                height={12}
                width="30%"
                sx={{
                  alignSelf: align === "right" ? "flex-end" : "flex-start",
                  bgcolor: "#444",
                }}
              />
            </CardContent>
          </ChatSkeletonBubble>
        );
      })}
    </Box>
  );
};

export default LoadingMessages;
