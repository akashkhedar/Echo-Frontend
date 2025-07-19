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
        marginBottom: 2,
        background: "#1E1E2F",
        borderRadius: "10px",
        boxShadow: "0px 2px 4px #000000",
        color: "whitesmoke",
        marginTop: 2,
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        action={
          <IconButton disabled>
            <MoreVertIcon sx={{ color: "#555" }} />
          </IconButton>
        }
        title={
          <Skeleton
            animation="wave"
            height={26}
            width="80%"
            style={{ marginBottom: 1 }}
          />
        }
        subheader={<Skeleton animation="wave" height={22} width="40%" />}
        sx={{ paddingY: "0.3rem" }}
      />

      {/* Image */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: 0,
          paddingTop: "56.25%", // mimic 16:9 image ratio
          backgroundColor: "#2a2a3b",
        }}
      />

      {/* Actions */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={30} height={25} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={30} height={25} />
        </Box>
      </CardActions>

      {/* Caption */}
      <CardContent sx={{ pt: 1 }}>
        <Skeleton
          variant="rounded"
          animation="wave"
          height={21}
          style={{ marginBottom: 6 }}
        />
        <Skeleton variant="rounded" animation="wave" height={21} width="80%" />
      </CardContent>
    </Card>
  );
};

export default PostCardSkeleton;
