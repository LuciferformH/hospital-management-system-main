import React, { useState } from 'react';
import api from '../../api/api';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Avatar,
    InputAdornment,
    IconButton
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function AdminRegister() {
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
        api
            .post("/auth/register-initial-admin", data)
            .then((res) => {
                if (res.data.message === "Success") {
                    Swal.fire({
                        title: "Setup Complete",
                        icon: "success",
                        text: "Admin account created successfully!",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        navigate("/sign-in");
                    });
                }
            })
            .catch((err) => {
                let errorMessage = "An unexpected error occurred. Please try again later.";
                
                if (err.response) {
                    errorMessage = err.response.data?.error || "Error Registering Admin!";
                    if (errorMessage.includes("must contain")) {
                         errorMessage = errorMessage.replace("Password must contain", "<b>Password Requirement:</b><br/>Must contain");
                    }
                } else if (err.request) {
                    errorMessage = "<b>Server unreachable!</b><br/>Please make sure the backend server is running.";
                } else {
                    errorMessage = err.message;
                }

                Swal.fire({
                    title: "Registration Error",
                    icon: "error",
                    html: errorMessage,
                    confirmButtonText: "Got it",
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 4
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 60, height: 60 }}>
                            <AdminPanelSettingsIcon fontSize="large" />
                        </Avatar>

                        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
                            Initial Admin Setup
                        </Typography>

                        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                            Register the first administrator for this system.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Admin Full Name"
                                name="userName"
                                autoComplete="name"
                                autoFocus
                                value={data.userName}
                                onChange={(e) => setData({ ...data, userName: e.target.value })}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
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
                                size="large"
                                sx={{ mt: 3, mb: 3, py: 1.5, fontSize: '1.1rem' }}
                            >
                                Complete Setup
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/sign-in" variant="subtitle2" underline="hover">
                                        Sign In
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}

export default AdminRegister;
