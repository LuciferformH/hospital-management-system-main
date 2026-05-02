import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Avatar
} from "@mui/material";
import {
  Message as MessageIcon,
  Send as SendIcon
} from "@mui/icons-material";
import profiePic from '../../../assets/doct2.jpg';
import DoctorSidebar from './DoctorSidebar';
import Swal from 'sweetalert2';
import api from '../../../api/api';

function DoctorReview() {
  const [userData, setuserData] = useState({});
  const [email, setEmail] = useState("");
  const [nurses, setNurses] = useState([]);
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");

  useEffect(() => {
    const fetchInfo = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setuserData(user);
        setFrom(user.name);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const getNurses = async () => {
      try {
        const response = await api.get("/nurse/get-allNurses");
        setNurses(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    };
    getNurses();
  }, []);

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!email || !message) {
      return Swal.fire("Warning", "Please select a nurse and enter a message", "warning");
    }

    api.post("/doctor/add-message", { email, message, from })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Message Sent",
          timer: 2000,
          showConfirmButton: false
        });
        setMessage("");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DoctorSidebar userName={userData.name} profiePic={profiePic} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <MessageIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Communicate with Nurses
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleAddMessage} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Nurse</InputLabel>
                <Select
                  value={email}
                  label="Select Nurse"
                  onChange={(e) => setEmail(e.target.value)}
                >
                  {nurses.map((nurse) => (
                    <MenuItem key={nurse._id} value={nurse.email}>
                      {nurse.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                placeholder="Enter your instructions or message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                disabled={!email || !message}
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default DoctorReview;
