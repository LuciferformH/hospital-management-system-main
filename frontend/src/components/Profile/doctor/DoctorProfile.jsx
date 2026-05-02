import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  MenuItem,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  MedicalServices as MedicalIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import api from "../../../api/api";
import Swal from "sweetalert2";
import DoctorSidebar from "./DoctorSidebar";
import { getUserAvatar } from "../../../utils/avatar";

function DoctorProfile() {
  const [userData, setuserData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    dateOfBirth: "",
    gender: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const fetchInfo = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setuserData(user);
        setFormData({
          name: user.name || "",
          mobileNumber: user.phoneno || "",
          address: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          dateOfBirth: user.dob ? user.dob.split("T")[0] : "",
          gender: user.gender || "",
          email: user.email || ""
        });
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/doctor/profile-update", {
        userId: userData._id,
        updatedProfile: {
          email: formData.email,
          name: formData.name,
          phoneno: formData.mobileNumber,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
          },
          gender: formData.gender,
          dob: formData.dateOfBirth,
        },
      });

      if (res.data.status === "Success") {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Profile Updated Successfully!",
          timer: 2000,
          showConfirmButton: false
        });
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setuserData(user);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error Updating Profile! Please Try Again!",
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return Swal.fire("Error", "New passwords do not match", "error");
    }

    try {
      const res = await api.post("/auth/change-password", {
        id: userData._id,
        role: "doctor",
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.message === "Password updated successfully") {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Password Updated Successfully!",
          timer: 2000,
          showConfirmButton: false
        });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      let errorMessage = "Error Updating Password!";
      
      if (err.response) {
        errorMessage = err.response.data?.error || "Update Failed!";
        if (errorMessage.includes("must contain")) {
           errorMessage = errorMessage.replace("Password must contain", "<b>Password Requirement:</b><br/>Must contain");
        }
      } else if (err.request) {
        errorMessage = "<b>Server unreachable!</b><br/>Please make sure the backend server is running.";
      } else {
        errorMessage = err.message;
      }
      
      Swal.fire({
        title: "Update Failed",
        icon: "error",
        html: errorMessage,
        confirmButtonText: "Got it"
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DoctorSidebar userName={userData.name} profilePic={getUserAvatar(userData)} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar
                src={getUserAvatar(userData)}
                alt={userData.name || 'Doctor'}
                sx={{ width: 56, height: 56 }}
              >
                <MedicalIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Account Settings
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2, height: 48, borderRadius: 2 }}
                  >
                    Save Profile Changes
                  </Button>
                </Grid>
              </Grid>
            </Box>


            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Change your password to keep your account secure.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    variant="outlined"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{ mt: 1, borderRadius: 3, fontWeight: 700 }}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box >
  );
}

export default DoctorProfile;
