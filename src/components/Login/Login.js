import {
  Alert,
  Box,
  Button,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import LoginImg from "../../assets/Login.jpg";
import axiosInstance from "../../axiosInstance";

const validationSchema = yup.object({
  user: yup.string().required("Field is required"),
  password: yup.string().required("Password is required"),
});

const LogInPage = () => {
  const [error, setError] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { values, errors, touched, handleBlur, handleSubmit, handleChange } =
    useFormik({
      initialValues: {
        user: "",
        password: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          setLoadingLogin(true);
          const res = await axiosInstance.post("/auth/login", {
            user: values.user,
            userPassword: values.password,
          });
          if (res.status === 200) {
            queryClient.setQueryData(["userDetails"], res.data.user);
            navigate("/");
          }
        } catch (error) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
          setLoadingLogin(false);
        }
      },
    });

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage:
          "linear-gradient(to left top, #5f604a, #4f5a48, #425347, #384b46, #314343, #2c3e41, #293a3f, #26353c, #22323c, #202f3d, #1f2c3d, #20283c)",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <Grid
        container
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%" },
          boxShadow: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "2px solid #434D5B",
        }}
      >
        <Grid
          item
          md={6}
          sx={{
            bgcolor: "#191919",
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${LoginImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "75vh",
            position: "relative", // Ensure absolute positioning works inside the Grid
          }}
        ></Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "#191919",
            padding: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="secondary"
              >
                Back!
              </Typography>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
              Login to Continue
            </Typography>
          </Box>
          <Box sx={{ height: "1vh" }}>
            {error && <Alert severity="error">Wrong Email/Password</Alert>}
          </Box>
          <Box
            sx={{
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Slide direction={"right"} in={true} mountOnEnter unmountOnExit>
                <Box>
                  <TextField
                    label="Your email"
                    variant="outlined"
                    fullWidth
                    id="user"
                    name="user"
                    value={values.user}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.user && Boolean(errors.user)}
                    helperText={touched.user && errors.user}
                    margin="normal"
                    InputLabelProps={{
                      style: { color: "white" }, // Label text color
                    }}
                    InputProps={{
                      style: { color: "white" }, // Input text color
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white", // Border color
                        },
                        "&:hover fieldset": {
                          borderColor: "lightgray", // Hover border color
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white", // Focus border color
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "red", // Helper text color
                      },
                    }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    margin="normal"
                    InputLabelProps={{
                      style: { color: "white" }, // Label text color
                    }}
                    InputProps={{
                      style: { color: "white" }, // Input text color
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white", // Border color
                        },
                        "&:hover fieldset": {
                          borderColor: "lightgray", // Hover border color
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white", // Focus border color
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "red", // Helper text color
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    align="right"
                    color="primary"
                    sx={{ cursor: "pointer", marginBottom: 2 }}
                  >
                    <Link
                      to="/forget-password"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Forgot password?
                    </Link>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      marginBottom: 2,
                      backgroundColor: "#ad19d2ff",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#82109eff",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(102, 14, 125, 1)", // darker blue when loading
                        color: "#fff",
                      },
                    }}
                    loading={loadingLogin}
                    loadingPosition="end"
                    disabled={loadingLogin}
                  >
                    Login
                  </Button>
                </Box>
              </Slide>
            </form>
          </Box>
          <Box>
            <Typography variant="body2" align="center">
              Don’t have an account?{" "}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Sign up
                </Link>
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogInPage;
