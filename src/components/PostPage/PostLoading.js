import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Box,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const PostCardSkeleton = () => {
  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: "92%",
          md: "67%",
          lg: "52%",
          xl: "40%",
        },
        mb: 2,
        mt: 2,
        bgcolor: "#0f0f1a",
        borderRadius: "14px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={44}
            height={44}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        }
        action={
          <IconButton disabled>
            <MoreVertIcon sx={{ color: "rgba(255,255,255,0.3)" }} />
          </IconButton>
        }
        title={
          <Skeleton
            animation="wave"
            height={20}
            width="60%"
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        }
        subheader={
          <Skeleton
            animation="wave"
            height={16}
            width="40%"
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        }
        sx={{ paddingY: 1.2 }}
      />

      {/* Image */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: 0,
          paddingTop: "56.25%", // 16:9
          bgcolor: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Actions */}
      <CardActions sx={{ px: 1.5, py: 1 }}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <Skeleton
            variant="circular"
            width={26}
            height={26}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            variant="text"
            width={32}
            height={20}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            variant="circular"
            width={26}
            height={26}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
          <Skeleton
            variant="text"
            width={32}
            height={20}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        </Box>
        <Skeleton
          variant="circular"
          width={26}
          height={26}
          sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
        />
      </CardActions>

      {/* Caption */}
      <CardContent sx={{ pt: 0.5 }}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={18}
          sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.08)" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          height={18}
          width="80%"
          sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
        />
      </CardContent>
    </Card>
  );
};

export default PostCardSkeleton;
