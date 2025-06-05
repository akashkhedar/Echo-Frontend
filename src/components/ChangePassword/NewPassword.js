import { Grid, Backdrop, Box, Fade, Modal, Typography } from "@mui/material";
import LoggedNewPass from "./Steps/LoggedNewPass";

const NewPassword = ({ open, handleClose }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 500 },
    bgcolor: "#121212",
    borderRadius: 3,
    boxShadow: 24,
    p: { xs: 3, sm: 4 },
    outline: "none",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="reset-password-title"
      aria-describedby="reset-password-description"
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            sx={{ minHeight: "70vh" }}
          >
            <Box mb={3}>
              <Typography
                id="reset-password-title"
                variant="h4"
                fontWeight="bold"
                color="violet"
                gutterBottom
              >
                Change Password
              </Typography>
              <Typography
                id="reset-password-description"
                variant="subtitle1"
                color="lightgray"
              >
                Reset your credentials to continue using <strong>Echo</strong>
              </Typography>
            </Box>

            <LoggedNewPass />

            <Box mt={4} textAlign="center">
              <Typography variant="caption" color="gray">
                Need help? Contact{" "}
                <a href="mailto:support@echo.com" style={{ color: "violet" }}>
                  support@echo.com
                </a>
              </Typography>
            </Box>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default NewPassword;
