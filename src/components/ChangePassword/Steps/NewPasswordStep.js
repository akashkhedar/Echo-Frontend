import { Box, TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosInstance from "../../../axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const passwordValidation = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must include at least one uppercase letter")
  .matches(/[a-z]/, "Must include at least one lowercase letter")
  .matches(/[0-9]/, "Must include at least one number")
  .matches(/[^A-Za-z0-9]/, "Must include at least one special character");

const validationSchema = yup.object({
  password: passwordValidation,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const NewPasswordStep = ({ setError }) => {
  const navigate = useNavigate();
  const { token } = useParams();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axiosInstance.post(`/update-password/${token}`, {
          newPassword: formik.values.password,
        });
        if (res.status === 200) {
          navigate("/login");
        }
      } catch (error) {
        setError(true);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Typography variant="h6" color="white" mb={2}>
        Set a new password
      </Typography>

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
        sx={{
          input: { color: "white" },
          label: { color: "lightgray" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "violet" },
            "&.Mui-focused fieldset": { borderColor: "violet" },
          },
        }}
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
        sx={{
          input: { color: "white" },
          label: { color: "lightgray" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "violet" },
            "&.Mui-focused fieldset": { borderColor: "violet" },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!formik.isValid || !formik.dirty}
        sx={{
          mt: 3,
          bgcolor: !formik.isValid || !formik.dirty ? "gray" : "violet",
          "&.Mui-disabled": {
            bgcolor: "gray",
            color: "white",
          },
        }}
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default NewPasswordStep;
