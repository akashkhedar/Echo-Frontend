import { Box, Skeleton, Stack } from "@mui/material";

const LoadingComments = () => {
  return (
    <Stack spacing={2}>
      {[...Array(3)].map((_, i) => (
        <Box key={i} display="flex" alignItems="flex-start" gap={2}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton variant="text" width="40%" height={14} />
            <Skeleton variant="text" width="90%" height={16} />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default LoadingComments;
