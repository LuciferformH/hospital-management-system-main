import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from '../../api/api';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  loginFailure,
  loginProgress,
  loginSuccess,
} from "../../redux/UserSlice.js";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
  Grid
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  LocalHospital as HospitalIcon,
  People as PeopleIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

function SignIn() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isAdminExists, setIsAdminExists] = useState(true);
  const [isPassVisible, setIsPassVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    api.get("/auth/check-admin")
      .then(res => {
        setIsAdminExists(res.data.hasAdmin);
      })
      .catch(err => console.error("Error checking admin:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    dispatch(loginProgress());
    api
      .post("/auth/login", data)
      .then((res) => {
        const { role, user, token } = res.data;
        if (role === "patient" || role === "admin") {
          dispatch(login(user));
          localStorage.setItem('user', JSON.stringify(user));
          navigate(role === "admin" ? "/admin-dashboard" : "/user-profile");
          dispatch(loginSuccess());
        } else if (role === "doctor" || role === "nurse") {
          dispatch(loginFailure());
          Swal.fire({
            title: "Invalid Role!",
            icon: "warning",
            text: `Please login through the ${role} sign-in page.`,
          });
        } else {
          dispatch(loginFailure());
          Swal.fire("Error", "Unauthorized access", "error");
        }
      })
      .catch((err) => {
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
          title: "Login Failed",
          icon: "error",
          html: errorMessage,
          confirmButtonText: "Got it"
        });
      });
  };

  const handleVisible = () => setIsPassVisible(!isPassVisible);

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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/sign-up" sx={{ fontWeight: 600 }}>
                Create one now
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
                type={isPassVisible ? 'text' : 'password'}
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
                disabled={loading}
                sx={{ mt: 3, mb: 2, height: 48, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Specialist Login
                </Typography>
              </Divider>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<HospitalIcon />}
                    onClick={() => navigate("/doctor-sign-in")}
                    sx={{ fontSize: '0.8rem' }}
                  >
                    Doctor
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate("/nurse-sign-in")}
                    sx={{ fontSize: '0.8rem' }}
                  >
                    Nurse
                  </Button>
                </Grid>
              </Grid>

              {!isAdminExists && (
                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    First Time Setup?
                  </Typography>
                  <Link component={RouterLink} to="/register-admin" variant="body2">
                    Register Initial Admin Account
                  </Link>
                </Alert>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default SignIn;
