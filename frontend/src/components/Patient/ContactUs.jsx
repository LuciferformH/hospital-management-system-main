import React, { useState } from "react";
import Navbar from "../Shared/Navbar";
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
  Stack
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/add-contact-us", formData);
      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "Ok",
        text: "Message Sent Successfully! We will get back to you soon!",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "Ok",
        text: "Error Sending Message! Please Try Again!",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <Grid container spacing={8} alignItems="center">
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h3" color="primary.dark" fontWeight="bold" gutterBottom>
                    Locate Us
                  </Typography>
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    HMS Trivandrum - India
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mt: 2 }}>
                    <LocationOnIcon color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="body1" color="text.secondary">
                      HMS, RandomAddress, ExampleBlah, <br />
                      Trivandrum – XXXXXX, Kerala, India
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <PhoneIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Telephone</Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 5 }}>+91 123 456 7890</Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <EmailIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Email</Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 5 }}>feedback@hms.org</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                  Get in Touch
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Phone / Mobile"
                        name="phone"
                        type="number"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
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
                        Submit Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

export default ContactUs;
