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
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import {
  AddCircle as BookIcon,
  DateRange as DateIcon,
  AccessTime as TimeIcon
} from "@mui/icons-material";
import { getUserAvatar } from "../../../utils/avatar";
import api from "../../../api/api";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";

function UserBookAppointment() {
  const [userData, setuserData] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    doctor: "",
    appointmentDate: "",
    time: "",
    reason: ""
  });
  const [doctors, setDoctors] = useState([]);

  const getDay = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchInfo = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setuserData(user);
        setFormData(prev => ({
          ...prev,
          userName: user.userName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        }));
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctor/get-doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };

    fetchDoctors();
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName, phoneNumber, doctor, appointmentDate, reason, email, time } = formData;

    if (!doctor || !appointmentDate || !time || !reason) {
      return Swal.fire("Warning", "Please fill in all required fields", "warning");
    }

    try {
      await api.post('/appointment/add-appointment', {
        patient: userName,
        phone: phoneNumber,
        doctor: doctor,
        appointmentDate: appointmentDate,
        reason: reason,
        email: email,
        time: time,
      });

      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Appointment Request Sent Successfully!",
        timer: 3000,
        showConfirmButton: false
      });

      setFormData(prev => ({
        ...prev,
        doctor: "",
        appointmentDate: "",
        time: "",
        reason: ""
      }));
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error Sending Appointment Request! Please Try Again!",
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <UserSidebar 
        profilePic={getUserAvatar(userData.email, userData.userName)} 
        userName={userData.userName} 
      />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                <BookIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Book Appointment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule your next visit with one of our specialists.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Info (Read-only or prefilled) */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Patient Name"
                    name="userName"
                    value={formData.userName}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    variant="outlined"
                    disabled
                  />
                </Grid>

                {/* Appointment Detail Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel id="doctor-select-label">Consultant Doctor</InputLabel>
                    <Select
                      labelId="doctor-select-label"
                      name="doctor"
                      value={formData.doctor}
                      label="Consultant Doctor"
                      onChange={handleChange}
                      sx={{ borderRadius: 2 }}
                    >
                      {doctors.length === 0 ? (
                        <MenuItem disabled value="">
                          <em>No doctors available</em>
                        </MenuItem>
                      ) : (
                        doctors.map((doc) => (
                          <MenuItem key={doc._id} value={doc._id}>
                            {doc.name} ({doc.specialization})
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Appointment Date"
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    variant="outlined"
                    inputProps={{ min: getDay() }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <DateIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Appointment Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <TimeIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Contact Phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Reason for Appointment"
                    multiline
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Briefly describe your symptoms or reason for visit."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2, height: 56, borderRadius: 3, fontWeight: 700, fontSize: '1.1rem' }}
                  >
                    Confirm Booking Request
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default UserBookAppointment;
