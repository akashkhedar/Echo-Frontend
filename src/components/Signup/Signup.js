import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Slide,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import SignupImg from "../../assets/Signup.jpg";
import axiosInstance from "../../axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Gradient from "../../assets/SignupGradient.png";
import imageCompression from "browser-image-compression";
import { setUser } from "../../redux/slices/AuthSlice/AuthSlice";
import { useDispatch } from "react-redux";

const usernameRegex = /^(?!.*[._]{2})[a-z0-9._]{4,25}$/;
const usernameBoundaryRegex = /^(?![._])[a-z0-9._]+(?<![._])$/;

const emailValidationSchema = yup.object({
  email: yup.string().email("Enter valid email").required("Email is required"),
});

const codeValidationSchema = yup.object({
  code: yup
    .string()
    .matches(/^\d{6}$/, "Code must be exactly 6 digits")
    .required("Field is required"),
});

const profileValidationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password should be 8 minimum characters")
    .required("Password is required"),
  username: yup
    .string()
    .required("Username cannot be empty")
    .min(4, "Username too short")
    .max(25, "Should be under 25 characters")
    .matches(
      usernameRegex,
      "Only lowercase letters, numbers, dots or underscores allowed. No consecutive dots or underscores."
    )
    .matches(
      usernameBoundaryRegex,
      "Cannot start or end with dot or underscore"
    ),

  fullname: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name too short")
    .max(25, "Should be under 25 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Full name should contain only letters and spaces"
    ),
  dob: yup.date().required("DOB is required").typeError("Invalid date format"),
  gender: yup.string().required("Choose a value"),
  file: yup
    .mixed()
    .required("Profile Picture is required")
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    }),
});

const SignUpPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState("left");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formikEmail = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/user/create", {
          email: values.email,
        });
        handleNext();
      } catch (error) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    },
  });

  const formikCode = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: codeValidationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/user/verify", {
          code: values.code,
        });
        handleNext();
      } catch (error) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    },
  });

  const formikProfile = useFormik({
    initialValues: {
      password: "",
      username: "",
      fullname: "",
      dob: null,
      gender: "",
      file: null,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };
      console.log(values.file);

      try {
        const compressImg = await imageCompression(values.file, options);
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dty9upcat/image/upload",
          { file: compressImg, upload_preset: "preset_echo" },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const res = await axiosInstance.post("/user/profile", {
          password: values.password,
          username: values.username,
          fullname: values.fullname,
          dob: values.dob,
          gender: values.gender,
          pic_url: response.data.secure_url,
        });
        if (res.status === 409) {
          formikProfile.setFieldError("username", "Username already taken");
        }
        if (res.status === 200) {
          dispatch(setUser(res.data));
          navigate("/");
        }
      } catch (error) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProfileImage(URL.createObjectURL(selectedFile));
      formikProfile.setFieldValue("file", selectedFile);
    }
  };

  const steps = ["Enter Email", "Verify Code", "Complete Profile"];

  const handleNext = () => {
    setDirection("left");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection("right");
    setActiveStep((prev) => prev - 1);
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            {/* Email Field */}
            {/* Email Field */}
            <form onSubmit={formikEmail.handleSubmit}>
              <Box mb={3} sx={{ height: "3vh" }}>
                {error && (
                  <Alert severity="error">Email Already Registered!</Alert>
                )}
              </Box>

              <TextField
                label="Your email"
                variant="outlined"
                name="email"
                fullWidth
                id="email"
                margin="normal"
                value={formikEmail.values.email}
                onBlur={formikEmail.handleBlur}
                error={
                  formikEmail.touched.email && Boolean(formikEmail.errors.email)
                }
                helperText={
                  formikEmail.touched.email && formikEmail.errors.email
                }
                onChange={formikEmail.handleChange}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                }}
              />
              {/* Continue Button */}
              <Button
                type="submit" // This makes the button submit the form
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  marginBottom: 2,
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Continue
              </Button>
            </form>
          </>
        );
      case 1:
        return (
          <>
            {/* Verification Code Field */}
            <form onSubmit={formikCode.handleSubmit}>
              <Box mb={3} sx={{ height: "3vh" }}>
                {error && <Alert severity="error">Invalid Code!</Alert>}
              </Box>
              <TextField
                label="Verification Code"
                variant="outlined"
                fullWidth
                margin="normal"
                name="code"
                id="code"
                value={formikCode.values.code}
                onBlur={formikCode.handleBlur}
                error={
                  formikCode.touched.code && Boolean(formikCode.errors.code)
                }
                helperText={formikCode.touched.code && formikCode.errors.code}
                onChange={formikCode.handleChange}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "lightgray" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />

              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      marginBottom: 2,
                      backgroundColor: "#333",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#444",
                      },
                    }}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      marginBottom: 2,
                      backgroundColor: "#1976d2",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                    }}
                  >
                    Verify
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        );
      case 2:
        return (
          <>
            {/* Password Field */}
            <form onSubmit={formikProfile.handleSubmit}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                id="password"
                name="password"
                value={formikProfile.values.password}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.password &&
                  Boolean(formikProfile.errors.password)
                }
                helperText={
                  formikProfile.touched.password &&
                  formikProfile.errors.password
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  marginBottom: 2,
                  marginTop: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "lightgray" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />

              {/* Username Field */}
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                id="username"
                name="username"
                value={formikProfile.values.username}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.username &&
                  Boolean(formikProfile.errors.username)
                }
                helperText={
                  formikProfile.touched.username &&
                  formikProfile.errors.username
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "lightgray" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />

              {/* Full Name Field */}
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                id="fullname"
                name="fullname"
                value={formikProfile.values.fullname}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.fullname &&
                  Boolean(formikProfile.errors.fullname)
                }
                helperText={
                  formikProfile.touched.fullname &&
                  formikProfile.errors.fullname
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "lightgray" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {/* Date of Birth */}
                <Grid item xs={6} sm={6}>
                  <DatePicker
                    selected={formikProfile.values.dob} // Bind Formik value
                    onChange={(date) =>
                      formikProfile.setFieldValue("dob", date)
                    } // Update Formik state
                    id="dob"
                    name="dob"
                    onBlur={() => formikProfile.setFieldTouched("dob", true)} // Update 'touched' state
                    maxDate={new Date()} // Disable future dates
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select your date of birth"
                    customInput={
                      <TextField
                        label="Date of Birth"
                        fullWidth
                        error={
                          formikProfile.touched.dob &&
                          Boolean(formikProfile.errors.dob)
                        } // Display error state
                        helperText={
                          formikProfile.touched.dob && formikProfile.errors.dob
                        } // Display error message
                        InputLabelProps={{
                          style: { color: "white" }, // Label color
                        }}
                        InputProps={{
                          style: { color: "white" }, // Input text color
                        }}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white", // Border color
                            },
                            "&:hover fieldset": {
                              borderColor: "lightgray", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "white", // Focused border color
                            },
                          },
                          "& .MuiInputBase-input": {
                            color: "white", // Input text color
                            backgroundColor: "transparent", // Dark background for visibility
                          },
                        }}
                      />
                    }
                  />
                </Grid>

                {/* Gender Selection */}
                <Grid item xs={6} sm={6} margin="normal">
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "white", // Label color
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "white", // Focused label color
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white", // Default border color
                        },
                        "&:hover fieldset": {
                          borderColor: "lightgray", // Hover border color
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white", // Focused border color
                        },
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white", // Dropdown arrow color
                      },
                    }}
                  >
                    <TextField
                      id="gender"
                      name="gender"
                      label="Gender"
                      value={formikProfile.values.gender}
                      onBlur={formikProfile.handleBlur}
                      error={
                        formikProfile.touched.gender &&
                        Boolean(formikProfile.errors.gender)
                      }
                      helperText={
                        formikProfile.touched.gender &&
                        formikProfile.errors.gender
                      }
                      onChange={formikProfile.handleChange}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        style: { color: "white" },
                      }}
                      sx={{
                        marginBottom: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "white" },
                          "&:hover fieldset": { borderColor: "lightgray" },
                          "&.Mui-focused fieldset": { borderColor: "white" },
                        },
                      }}
                      select
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Profile Picture Selector */}
              <Box
                sx={{
                  textAlign: "center",
                  padding: 2,
                  border: "1px dashed white",
                  borderRadius: "8px",
                  marginBottom: 2,
                  color: "white",
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  {profileImage === null
                    ? "Upload Profile Picture"
                    : "Choose Another"}
                  <input
                    type="file"
                    id="file"
                    name="file"
                    error={
                      formikProfile.touched.file &&
                      Boolean(formikProfile.errors.file)
                    }
                    helperText={
                      formikProfile.touched.file && formikProfile.errors.file
                    }
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {formikProfile.touched.file && formikProfile.errors.file && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                      marginTop: 1,
                      display: "block",
                    }}
                  >
                    {formikProfile.errors.file}
                  </Typography>
                )}

                {profileImage && (
                  <Box
                    sx={{
                      marginTop: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ marginBottom: 1, color: "white" }}
                    >
                      Preview:
                    </Typography>
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #1976d2",
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Complete Sign-Up Button */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  textTransform: "none",
                  backgroundColor: "#1976d2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Complete Sign Up
              </Button>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${Gradient})`,
        backgroundSize: "cover",
        color: "white",
      }}
    >
      <Grid
        container
        sx={{
          height: "87vh",
          width: { xs: "90%", sm: "80%", md: "70%" },
          boxShadow: 3,
          borderRadius: 4,
          overflow: "hidden",
          border: "2px solid #333",
        }}
      >
        {/* Left Side */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: "#191919",
            padding: { xs: 4, sm: 6 },
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "90vh",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Hi there!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Welcome to Echo. Register to Continue
            </Typography>
            <Stepper
              activeStep={activeStep}
              sx={{
                width: "100%",
                marginBottom: 2,
                marginTop: 3,
                ".MuiStep-root": {
                  color: "white", // Default step color
                },
                ".MuiStepLabel-label": {
                  color: "gray", // Non-active label color
                },
                ".MuiStepLabel-label.Mui-active": {
                  color: "white", // Active step label color
                },
                ".MuiStepLabel-label.Mui-completed": {
                  color: "lightgreen", // Completed step label color
                },
                ".MuiStepIcon-root": {
                  color: "gray", // Default icon color
                },
                ".MuiStepIcon-root.Mui-active": {
                  color: "white", // Active icon color
                },
                ".MuiStepIcon-root.Mui-completed": {
                  color: "lightgreen", // Completed icon color
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box
            mt={1}
            sx={{
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            <Slide direction={direction} in={true} mountOnEnter unmountOnExit>
              <Box>{renderForm()}</Box>
            </Slide>
          </Box>
          <Box mt={2}>
            <Typography variant="body2" align="center" pb={1}>
              Already have an account?{" "}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: "pointer" }}
              >
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Log in
                </Link>
              </Typography>
            </Typography>
          </Box>
        </Grid>
        {/* Right Side */}
        <Grid
          item
          md={6}
          sx={{
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${SignupImg})`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%", // Keep height fixed
          }}
        ></Grid>
      </Grid>
    </Box>
  );
};

export default SignUpPage;
