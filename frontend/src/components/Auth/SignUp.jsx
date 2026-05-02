import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Avatar,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  AppRegistration as RegisterIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { motion } from "framer-motion";

function SignUp() {
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isPassVisible, setIsPassVisible] = useState(false);
  const navigate = useNavigate();

  const handleVisible = () => setIsPassVisible(!isPassVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.userName || !data.email || !data.password) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    api
      .post("/auth/register", data)
      .then((res) => {
        if (res.data.message === "Success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Account created successfully! Please sign in.",
            timer: 2000,
            showConfirmButton: false
          });
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        let errorMessage = "An unexpected error occurred. Please try again later.";
        
        if (err.response) {
            // Server responded with an error (e.g., 400, 401, 500)
            errorMessage = err.response.data?.error || "Error Registering User! Please Try Again!";
            
            if (errorMessage.includes("must contain")) {
                errorMessage = errorMessage.replace("Password must contain", "<b>Password Requirement:</b><br/>Must contain");
            }
        } else if (err.request) {
            // The request was made but no response was received (Server is likely down)
            errorMessage = "<b>Server unreachable!</b><br/>Please make sure the backend server is running.";
        } else {
            // Something happened in setting up the request
            errorMessage = err.message;
        }

        Swal.fire({
          title: "Registration Error",
          icon: "error",
          html: errorMessage,
          confirmButtonText: "Got it"
        });
      });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <RegisterIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/sign-in" sx={{ fontWeight: 600 }}>
                Sign In
              </Link>
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Full Name"
                name="userName"
                autoComplete="name"
                autoFocus
                value={data.userName}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={isPassVisible ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleVisible} edge="end">
                        {isPassVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, height: 48, fontSize: '1rem' }}
              >
                Sign Up
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default SignUp;
