import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  loginFailure,
  loginProgress,
  loginSuccess,
} from "../../redux/UserSlice.js";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Medication as DoctorIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

function DoctorAuth() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [isPassVisible, setIsPassVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  const handleVisible = () => {
    setIsPassVisible(!isPassVisible);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    dispatch(loginProgress());
    api.
      post("/auth/login", data)
      .then((res) => {
        if (res.data.role === "doctor") {
          const user = res.data.user;
          dispatch(login(user));
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/doctor-profile')
          dispatch(loginSuccess());
        } else if (res.data.role === "patient" || res.data.role === "admin" || res.data.role === "nurse") {
          dispatch(loginFailure());
          Swal.fire({
            title: "Wrong Portal!",
            icon: "warning",
            confirmButtonText: "Ok",
            text: `You are a ${res.data.role}. Please login through the correct page!`,
          });
        } else {
          dispatch(loginFailure());
          Swal.fire({
            title: "Invalid Access!",
            icon: "error",
            confirmButtonText: "Ok",
            text: "You are not authorized to access this page!",
          });
        }

      }).catch((err) => {
        dispatch(loginFailure());
        
        let errorMessage = "Please check your credentials and try again.";
        if (err.response) {
          errorMessage = err.response.data?.error || "Login Failed!";
          if (errorMessage.includes("must contain")) {
             errorMessage = errorMessage.replace("Password must contain", "<b>Password Requirement:</b><br/>Must contain");
          }
        } else if (err.request) {
            errorMessage = "<b>Server unreachable!</b><br/>Please make sure the backend server is running.";
        } else {
            errorMessage = err.message;
        }

        Swal.fire({
          title: "Invalid Credentials!",
          icon: "error",
          html: errorMessage,
          confirmButtonText: "Got it"
        });
      })
  }

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <DoctorIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Doctor Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Login as a Patient?{' '}
              <Link component={RouterLink} to="/sign-in" sx={{ fontWeight: 600 }}>
                Click Here
              </Link>
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                type={isPassVisible ? "text" : "password"}
                id="password"
                autoComplete="current-password"
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
                      <IconButton
                        onClick={handleVisible}
                        edge="end"
                      >
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
                color="secondary"
                disabled={loading}
                sx={{ mt: 3, mb: 2, height: 48, fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default DoctorAuth;
