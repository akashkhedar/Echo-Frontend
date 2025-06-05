import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import axiosInstance from "../../../axiosInstance";

const passwordValidation = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must include at least one uppercase letter")
  .matches(/[a-z]/, "Must include at least one lowercase letter")
  .matches(/[0-9]/, "Must include at least one number")
  .matches(/[^A-Za-z0-9]/, "Must include at least one special character");

const validationSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const LoggedNewPass = () => {
  const { token } = useParams();
  const [mail, setMail] = useState(false);
  const [pass, setPass] = useState(false);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post("/update/logged/password", {
          currentPassword: values.currentPassword,
          newPassword: values.password,
        });
        if (res.status === 200) {
          setPass(true);
          setTimeout(() => {
            setPass(false);
          }, 2000);
        }
        if (res.status === 401) {
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
      } catch (error) {
        setError(true);
      }
    },
  });

  const fieldStyles = {
    input: { color: "white" },
    label: { color: "lightgray" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "violet" },
      "&.Mui-focused fieldset": { borderColor: "violet" },
    },
  };

  const email = useSelector((state) => state.user.email);

  const handleForgetPassword = async () => {
    try {
      const res = await axiosInstance.post("/forget-password", {
        userInfo: email,
      });

      if (res.status === 200) {
        setMail(true);
        setTimeout(() => {
          setMail(false);
        }, 2000);
      }
    } catch (error) {}
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Typography variant="h6" fontWeight="bold" color="white" mb={3}>
        Set a New Password
      </Typography>
      {mail && (
        <Alert severity="success">
          Please check you registered mail for password reset link
        </Alert>
      )}

      {error && <Alert severity="error">Wrong current password</Alert>}
      {pass && <Alert severity="success">Password changed successfully</Alert>}

      <TextField
        fullWidth
        type="password"
        label="Current Password"
        name="currentPassword"
        value={formik.values.currentPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.currentPassword &&
          Boolean(formik.errors.currentPassword)
        }
        helperText={
          formik.touched.currentPassword && formik.errors.currentPassword
        }
        variant="outlined"
        margin="normal"
        sx={fieldStyles}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={handleForgetPassword}
          variant="text"
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "rgb(191, 13, 214)",
            minWidth: "unset", // removes default min width
            textTransform: "none", // keeps natural casing
            "&:hover": {
              color: "#d05ce3",
              backgroundColor: "transparent",
            },
          }}
        >
          Forgot password?
        </Button>
      </Box>

      <TextField
        fullWidth
        type="password"
        label="New Password"
        name="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        variant="outlined"
        margin="normal"
        sx={fieldStyles}
      />

      <TextField
        fullWidth
        type="password"
        label="Confirm Password"
        name="confirmPassword"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.confirmPassword &&
          Boolean(formik.errors.confirmPassword)
        }
        helperText={
          formik.touched.confirmPassword && formik.errors.confirmPassword
        }
        variant="outlined"
        margin="normal"
        sx={fieldStyles}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!formik.isValid || !formik.dirty}
        sx={{
          mt: 4,
          bgcolor: !formik.isValid || !formik.dirty ? "gray" : "violet",
          color: "white",
          fontWeight: "bold",
          "&.Mui-disabled": {
            bgcolor: "gray",
            color: "white",
          },
          transition: "background-color 0.3s",
        }}
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default LoggedNewPass;
