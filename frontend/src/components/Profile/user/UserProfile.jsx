import React, { useEffect, useState } from "react";
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
  Person as PersonIcon,
  Save as SaveIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import api from "../../../api/api";
import UserSidebar from "./UserSidebar";
import Swal from "sweetalert2";
import { getUserAvatar } from "../../../utils/avatar";

function UserProfile() {
  const [userData, setuserData] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
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
          userName: user.userName || "",
          phoneNumber: user.phoneNumber || "",
          address: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
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
      const res = await api.put("/user/profile-update", {
        userId: userData._id,
        updatedProfile: {
          email: formData.email,
          userName: formData.userName,
          phoneNumber: formData.phoneNumber,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
          },
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
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
        role: "patient",
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
      <UserSidebar userName={userData.userName} profilePic={getUserAvatar(userData)} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar
                src={getUserAvatar(userData)}
                alt={userData.userName || 'User'}
                sx={{ width: 60, height: 60 }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Account Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal information and preferences.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="User Name"
                    name="userName"
                    value={formData.userName}
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
                    name="phoneNumber"
                    value={formData.phoneNumber}
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
                    label="Street Address"
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
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2, height: 50, borderRadius: 3, fontWeight: 700 }}
                  >
                    Save Changes
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

export default UserProfile;
