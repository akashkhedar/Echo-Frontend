import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import axiosInstance from "../../axiosInstance";
import DeleteAccountModal from "./DeleteAccountModal";

const usernameRegex = /^(?!.*[._]{2})[a-z0-9._]{4,25}$/;
const usernameBoundaryRegex = /^(?![._])[a-z0-9._]+(?<![._])$/;

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
  profileFile: yup
    .mixed()
    .nullable()
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true;
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          value.type
        )
      );
    }),
  coverFile: yup
    .mixed()
    .nullable()
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true;
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          value.type
        )
      );
    }),
});

const AboutUpdate = ({ open, handleClose, user }) => {
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [coverImage, setCoverImage] = useState(user.coverImage);
  const queryClient = useQueryClient();

  const handleProfileFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formikProfile.setFieldValue("profileFile", file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleCoverFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formikProfile.setFieldValue("coverFile", file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const formikProfile = useFormik({
    initialValues: {
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      interests: user.interests,
      website: user.website,
      dob: user.dob,
      gender: user.gender,
      profileFile: null,
      coverFile: null,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const updatedFields = {};

        // Handle profile image
        if (values.profileFile) {
          const options = {
            maxSizeMB: 1,
            useWebWorker: true,
          };
          const compressImg = await imageCompression(
            values.profileFile,
            options
          );
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dty9upcat/image/upload",
            { file: compressImg, upload_preset: "preset_echo" },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (response?.data?.secure_url) {
            updatedFields.profileImage = response.data.secure_url;
          }
        }

        // Handle cover image
        if (values.coverFile) {
          const options = {
            maxSizeMB: 1,
            useWebWorker: true,
          };
          const compressImg = await imageCompression(values.coverFile, options);
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dty9upcat/image/upload",
            { file: compressImg, upload_preset: "preset_echo" },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (response?.data?.secure_url) {
            updatedFields.coverImage = response.data.secure_url;
          }
        }

        // Add other fields if they've changed
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

        const res = await axiosInstance.post(
          "/user/update/profile",
          updatedFields
        );

        if (res.status === 200) {
          queryClient.setQueryData(["user"], res.data.user);
          setLoading(false);
          handleClose();
        }
      } catch (err) {
        setLoading(false);
        if (err.response?.status === 409) {
          formikProfile.setFieldError("username", "Username already taken");
        }
      }
    },
  });

  const [delModal, setDelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const openDelModal = () => setDelModal(true);
  const closeDelModal = () => setDelModal(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              overflowY: "auto",
              height: isMobile ? "90vh" : "35rem",
              width: isMobile ? "90vw" : 400,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#0b0909ff",
              border: "2px solid #4a4646ff",
              boxShadow: 24,
              borderRadius: 2,
              px: isMobile ? 2 : 4,
              py: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#1e1e1e",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#4a4646ff",
                borderRadius: "4px",
                "&:hover": {
                  background: "#666",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                fontWeight={700}
                color="#d900ffff"
                sx={{
                  flexGrow: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Edit Profile
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#878181ff",
                  ml: 1,
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                formikProfile.handleSubmit();
              }}
            >
              {/* Cover Image Upload */}
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
                <Typography variant="subtitle1" gutterBottom>
                  Cover Image
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    mb: 2,
                  }}
                >
                  <img
                    src={coverImage}
                    alt="Cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Typography variant="caption" color="gray">
                  Click to change cover image
                </Typography>
              </Box>

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
                    id="profileFile"
                    name="profileFile"
                    hidden
                    onChange={handleProfileFileChange}
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
                onChange={formikProfile.handleChange}
                onBlur={async (e) => {
                  formikProfile.handleBlur(e);

                  const value = e.target.value;

                  if (value.length >= 4) {
                    const exists = await usernameExists(value);
                    if (exists) {
                      formikProfile.setFieldError(
                        "username",
                        "Username already taken"
                      );
                    }
                  }
                }}
                error={
                  formikProfile.touched.username &&
                  Boolean(formikProfile.errors.username)
                }
                helperText={
                  formikProfile.touched.username &&
                  formikProfile.errors.username
                }
                InputLabelProps={{
                  sx: { color: "secondary.light" },
                }}
                InputProps={{
                  sx: { color: "white" },
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
              <Grid
                container
                spacing={isMobile ? 0 : 2}
                direction={isMobile ? "column" : "row"}
                sx={{ marginBottom: 2 }}
              >
                {/* Date of Birth */}
                <Grid item xs={12} sm={6}>
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
                          "& svg": {
                            color: "white",
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Gender Selection */}
                <Grid item xs={12} sm={6}>
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
                loading={loading}
                loadingPosition="end"
                disabled={loading}
              >
                Save Changes
              </Button>
            </form>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              onClick={openDelModal}
              sx={{
                mt: 2,
                textTransform: "none",
                backgroundColor: "red",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgb(145, 50, 50)",
                },
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Fade>
        <DeleteAccountModal delModal={delModal} closeDelModal={closeDelModal} />
      </LocalizationProvider>
    </Modal>
  );
};

export default AboutUpdate;
