import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate } from "react-router-dom";

import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";

const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) return;

    const data = await signup(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    // Username validation
    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Username must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Username should not contain spaces";
    }

    // Password validation
    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    }

    // Email validation
    if (!isEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setErrors(errors);
    return errors;
  };

  return (
    <Container maxWidth={"xs"} sx={{ mt: { xs: 2, md: 6 } }}>
      <Stack alignItems="center">
        <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
          <Link to="/" color="inherit" underline="none">
            SOCCET ! ⭐
          </Link>
        </Typography>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Typography color="text.secondary">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            autoFocus
            required
            id="username"
            name="username"
            onChange={handleChange}
            error={errors.username !== undefined}
            helperText={errors.username}
            sx={{
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            required
            id="email"
            name="email"
            onChange={handleChange}
            error={errors.email !== undefined}
            helperText={errors.email}
            sx={{
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            error={errors.password !== undefined}
            helperText={errors.password}
            sx={{
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          />
          <ErrorAlert error={serverError} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              my: 2,
              padding: "12px",
              borderRadius: "8px",
              fontSize: "16px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Sign Up
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}></Box>
      </Stack>
    </Container>
  );
};

export default SignupView;
