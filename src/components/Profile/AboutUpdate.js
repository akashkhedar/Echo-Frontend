import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useFormik } from "formik";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import axiosInstance from "../../axiosInstance";
import { setUser } from "../../redux/slices/AuthSlice/AuthSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import socket from "../../utils/socket";
import { debounce } from "lodash";

const style = {
  position: "absolute",
  overflowY: "auto",
  height: "35rem",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1e1e2f",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 2,
  px: 4,
  py: 2,
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
};

const usernameRegex = /^(?!.*[._]{2})[a-z0-9._]{4,25}$/;
const usernameBoundaryRegex = /^(?![._])[a-z0-9._]+(?<![._])$/;

const profileValidationSchema = yup.object({
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
  bio: yup.string().max(135, "135 characters only"),
  interests: yup.string().max(100, "100 characters only"),
  website: yup.string(),
  dob: yup.date().required("DOB is required").typeError("Invalid date format"),
  gender: yup.string().required("Choose a value"),
  file: yup
    .mixed()
    .nullable()
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) {
        return true;
      } else {
        return (
          value &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/tiff",
            "image/webp",
            "image/svg",
            "image/bmp",
            "image/heif",
          ].includes(value.type)
        );
      }
    }),
});

const AboutUpdate = ({ open, handleClose, user }) => {
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [error, setError] = useState(false);
  const userId = useSelector((state) => state.user._id);

  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setProfileImage(URL.createObjectURL(selectedFile));
      formikProfile.setFieldValue("file", selectedFile);
    }
  };

  const checkUsername = debounce(async (username, setFieldError) => {
    try {
      await axiosInstance.get(`/check/username?username=${username}`);
    } catch (error) {
      if (error.status === 409) {
        setFieldError("username", "Username already taken");
      }
    }
  }, 100);

  useEffect(() => {
    return () => {
      checkUsername.cancel();
    };
  }, []);

  const formikProfile = useFormik({
    initialValues: {
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      interests: user.interests,
      website: user.website,
      dob: user.dob,
      gender: user.gender,
      file: null,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };
      try {
        const updatedFields = {};

        if (values.file) {
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
          if (response?.data?.secure_url)
            updatedFields.profileImage = response.data.secure_url;
        }

        if (values.username !== user.username)
          updatedFields.username = values.username;
        if (values.fullname !== user.fullname)
          updatedFields.fullname = values.fullname;
        if (values.bio !== user.bio) updatedFields.bio = values.bio;
        if (values.interests !== user.interests)
          updatedFields.interests = values.interests;
        if (values.website !== user.website)
          updatedFields.website = values.website;
        if (values.dob !== user.dob) updatedFields.dob = values.dob;
        if (values.gender !== user.gender) updatedFields.gender = values.gender;

        const res = await axiosInstance.post("/update/profile", updatedFields);
        if (res.status === 200) {
          dispatch(setUser(res.data.user));
          handleClose();
        }
      } catch (err) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              id="transition-modal-title"
              variant="h5"
              fontWeight={800}
              color="secondary.light"
              pb={2}
            >
              Edit Profile
            </Typography>
            <form onSubmit={formikProfile.handleSubmit}>
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
                onChange={(e) => {
                  formikProfile.handleChange(e);
                  const newUsername = e.target.value;
                  if (newUsername.length >= 4) {
                    checkUsername(newUsername, formikProfile.setFieldError);
                  }
                }}
                InputLabelProps={{
                  sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
                }}
                InputProps={{
                  sx: { color: "white" }, // or use a hex code like "#FFFF00"
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
                  sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
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
              {/* Bio Field */}
              <TextField
                label="Bio"
                variant="outlined"
                fullWidth
                id="bio"
                name="bio"
                value={formikProfile.values.bio}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.bio && Boolean(formikProfile.errors.bio)
                }
                helperText={
                  formikProfile.touched.bio && formikProfile.errors.bio
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
                }}
                InputProps={{
                  sx: { color: "white" }, // or use a hex code like "#FFFF00"
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
              {/* website Field */}
              <TextField
                label="website"
                variant="outlined"
                fullWidth
                id="website"
                name="website"
                value={formikProfile.values.website}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.website &&
                  Boolean(formikProfile.errors.website)
                }
                helperText={
                  formikProfile.touched.website && formikProfile.errors.website
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
                }}
                InputProps={{
                  sx: { color: "white" }, // or use a hex code like "#FFFF00"
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
              {/* interests Field */}
              <TextField
                label="Interests"
                variant="outlined"
                fullWidth
                id="interests"
                name="interests"
                value={formikProfile.values.interests}
                onBlur={formikProfile.handleBlur}
                error={
                  formikProfile.touched.interests &&
                  Boolean(formikProfile.errors.interests)
                }
                helperText={
                  formikProfile.touched.interests &&
                  formikProfile.errors.interests
                }
                onChange={formikProfile.handleChange}
                InputLabelProps={{
                  sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
                }}
                InputProps={{
                  sx: { color: "white" }, // or use a hex code like "#FFFF00"
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
                    value={
                      formikProfile.values.dob
                        ? dayjs(formikProfile.values.dob)
                        : null
                    }
                    onChange={(date) => {
                      // Convert back to JS Date if your form expects Date, or store dayjs
                      formikProfile.setFieldValue(
                        "dob",
                        date ? date.toDate() : null
                      );
                    }}
                    onBlur={() => formikProfile.setFieldTouched("dob", true)}
                    maxDate={dayjs()} // Must be dayjs, not new Date()
                    slotProps={{
                      textField: {
                        label: "Date of Birth",
                        fullWidth: true,
                        error:
                          formikProfile.touched.dob &&
                          Boolean(formikProfile.errors.dob),
                        helperText:
                          formikProfile.touched.dob && formikProfile.errors.dob,
                        InputLabelProps: {
                          style: { color: "rgb(196, 98, 220)" },
                        },
                        InputProps: {
                          style: { color: "white" },
                        },
                        sx: {
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" },
                            "&:hover fieldset": { borderColor: "lightgray" },
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputBase-input": {
                            color: "white",
                            backgroundColor: "transparent",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Gender Selection */}
                <Grid item xs={6} sm={6} margin="normal">
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "secondary.light", // Label color
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
                        sx: { color: "secondary.light" }, // or use a hex code like "#FFFF00"
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

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  textTransform: "none",
                  backgroundColor: "secondary.light",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Save Changes
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </LocalizationProvider>
  );
};

export default AboutUpdate;
