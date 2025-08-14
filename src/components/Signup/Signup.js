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
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useFormik } from "formik";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import SignupImg from "../../assets/Signup.jpg";
import axiosInstance from "../../axiosInstance";

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

const usernameExists = async (username) => {
  try {
    await axiosInstance.get(`/user/check/username?username=${username}`);
    return false; // username doesn't exist
  } catch (error) {
    if (error.response?.status === 409) {
      return true; // username already taken
    }
    return false;
  }
};

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
    )
    .test("is-unique", "Username already taken", async function (value) {
      if (!value) return true;
      const exists = await usernameExists(value);
      return !exists;
    }),

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
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          value.type
        )
      );
    }),
});

const SignUpPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState("left");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleEmailSubmit = () => {
    setLoadingEmail(true);
  };

  const [loadingCode, setLoadingCode] = useState(false);

  const handleCodeSubmit = () => {
    setLoadingCode(true);
  };

  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleProfileSubmit = () => {
    setLoadingProfile(true);
  };

  const formikEmail = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post("/auth/create", {
          email: values.email,
        });
        if (res.status === 200) {
          handleNext();
          setLoadingEmail(false);
        }
      } catch (error) {
        setLoadingEmail(false);
        if (error.status === 401) {
          setActiveStep((prev) => prev + 2);
        }
        if (error.status === 409) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
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
        await axiosInstance.post("/auth/verify", {
          code: values.code,
        });
        setLoadingCode(false);
        handleNext();
      } catch (error) {
        setLoadingCode(false);
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

      try {
        const compressImg = await imageCompression(values.file, options);
        const formData = new FormData();
        formData.append("file", compressImg);
        formData.append("upload_preset", "preset_echo");

        const response = await axios.post(
         "https://api.cloudinary.com/v1_1/dty9upcat/image/upload",
          formData,
         {
             headers: { "Content-Type": "multipart/form-data" },
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
        setLoadingProfile(false);
       if (res.status === 409) {
           formikProfile.setFieldError("username", "Username already taken");
       } else if (res.status >= 200 && res.status < 300) {
           queryClient.setQueryData(["userDetails"], res.data.user);
           navigate("/");
      }
      } catch (error) {
        setLoadingProfile(false);
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
    handleEmailSubmit();
    setDirection("right");
    setActiveStep((prev) => prev - 1);
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formikEmail.handleSubmit();
                handleEmailSubmit();
              }}
            >
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={loadingEmail}
                loadingPosition="end"
                disabled={loadingEmail}
                sx={{
                  textTransform: "none",
                  marginBottom: 2,
                  backgroundColor: "#2000c1ff",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0a0763ff",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#0a0763ff", // darker blue when loading
                    color: "#fff",
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formikCode.handleSubmit();
                handleCodeSubmit();
              }}
            >
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
                      backgroundColor: "#2000c1ff",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#0a0763ff",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#0a0763ff", // darker blue when loading
                        color: "#fff",
                      },
                    }}
                    loading={loadingCode}
                    loadingPosition="end"
                    disabled={loadingCode}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formikProfile.handleSubmit();
                handleProfileSubmit();
              }}
            >
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
                          "& svg": {
                            color: "white",
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
                    backgroundColor: "#2000c1ff",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#0a0763ff",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#0a0763ff", // darker blue when loading
                      color: "#fff",
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
                  backgroundColor: "#2000c1ff",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0a0763ff",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#0a0763ff", // darker blue when loading
                    color: "#fff",
                  },
                }}
                loading={loadingProfile}
                loadingPosition="end"
                disabled={loadingProfile}
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
        background: `radial-gradient(
    circle at 68% 48%,
    #ff7c33 0%,
    #ff3c6d 15%,
    #6b23e1 30%,
    #00d4ff 45%,
    #003e69 60%,
    #000814 80%,
    #000000 100%
  )`,
        backgroundBlendMode: "darken",
        backgroundSize: "cover",
        color: "white",
        filter: "brightness(0.9)",
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
            background: "#111111ff",
            padding: { xs: 4, sm: 6 },
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "90vh",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#d900ffff"
              gutterBottom
            >
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
                <Step sx={{ ml: -1 }} key={label}>
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
            bgcolor: "#191919",
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
