import React, { useEffect, useState } from "react";
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
  Grid,
  Avatar
} from "@mui/material";
import {
  Medication as MedicationIcon,
  Assignment as AssignmentIcon
} from "@mui/icons-material";
import profilePic from "../../../assets/doct5.jpg";
import api from "../../../api/api";
import Swal from "sweetalert2";
import NurseSidebar from "./NurseSidebar";

function NurseMedication() {
  const [userData, setuserData] = useState({});
  const [patients, setPatients] = useState([]);
  const [medicationData, setMedicationData] = useState({
    name: "",
    frequency: "",
    dosage: "",
    patientEmail: ""
  });

  useEffect(() => {
    const fetchInfo = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) setuserData(user);
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user/get-users");
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setMedicationData({ ...medicationData, [e.target.name]: e.target.value });
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    const { name, frequency, dosage, patientEmail } = medicationData;
    if (!name || !frequency || !dosage || !patientEmail) {
      return Swal.fire("Warning", "Please fill in all fields", "warning");
    }

    try {
      await api.post(`/user/add-medications/${patientEmail}`, { name, frequency, dosage });
      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Medication added successfully",
        timer: 2000,
        showConfirmButton: false
      });
      setMedicationData({ ...medicationData, name: "", frequency: "", dosage: "" });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error adding medication. Please try again.",
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <NurseSidebar userName={userData.name} profilePic={profilePic} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <MedicationIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Manage Medication
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleAddMedication} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Patient</InputLabel>
                <Select
                  name="patientEmail"
                  value={medicationData.patientEmail}
                  label="Select Patient"
                  onChange={handleChange}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient._id} value={patient.email}>
                      {patient.userName} ({patient.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name of Medicine"
                    name="name"
                    value={medicationData.name}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="e.g. Paracetamol"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    name="dosage"
                    value={medicationData.dosage}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="e.g. 500mg or 2 tablets"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frequency"
                    name="frequency"
                    value={medicationData.frequency}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="e.g. Twice a day"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                color="info"
                startIcon={<AssignmentIcon />}
                sx={{ py: 1.5, mt: 2, borderRadius: 2 }}
              >
                Add Prescription
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default NurseMedication;
