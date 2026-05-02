import React, { useEffect, useState } from "react";
import Navbar from "../Shared/Navbar";
import appoint from "../../assets/appoint.png";
import api from "../../api/api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";

function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const [appointment, setAppointment] = useState({
    patient: "",
    phone: "",
    appointmentDate: "",
    time: "",
    doctor: "",
    reason: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctor/get-doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/appointment/add-appointment`, appointment);
      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "Ok",
        text: "Appointment Request Sent Successfully!",
      });
      // Optional: Reset form here
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Error Sending Appointment Request! Please Try Again!",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Grid container>
              {/* Image Section - Hidden on Mobile */}
              <Grid item xs={12} lg={5} sx={{ display: { xs: 'none', lg: 'flex' }, bgcolor: 'primary.light', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Box component="img" src={appoint} sx={{ width: '100%', maxWidth: 400 }} alt="Appointment" />
              </Grid>

              {/* Form Section */}
              <Grid item xs={12} lg={7} sx={{ p: { xs: 3, md: 6 } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.dark">
                  Book an Appointment
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Fill out the form below to schedule a consultation with our specialists.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Patient Name"
                        name="patient"
                        value={appointment.patient}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        type="number"
                        value={appointment.phone}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Date"
                        name="appointmentDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={appointment.appointmentDate}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Time"
                        name="time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={appointment.time}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="City"
                        name="city"
                        value={appointment.city}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={appointment.email}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Consultant Doctor"
                        name="doctor"
                        value={appointment.doctor}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="" disabled>Choose a Doctor</MenuItem>
                        {doctors.map((doc) => (
                          <MenuItem key={doc._id} value={doc.name}>
                            {doc.name} - {doc.specialization || 'General'}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason for Visit"
                        name="reason"
                        multiline
                        rows={3}
                        value={appointment.reason}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ py: 1.5, fontSize: '1.1rem' }}
                      >
                        Confirm Appointment
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Appointment;
