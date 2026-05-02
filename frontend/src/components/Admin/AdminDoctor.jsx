import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalServices as MedicalIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader";
import AdminSidebar from "./AdminSidebar";
import { getUserAvatar } from "../../utils/avatar";

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);

  const [docData, setDocData] = useState({
    name: "",
    specialization: "",
    email: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/doctor/get-doctors");
      setDoctors(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Error Fetching Data!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!docData.name || !docData.email || !docData.specialization) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    try {
      const res = await api.post("/doctor/add-doctor", docData);
      if (res.data.message === "Success") {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Doctor Added Successfully!",
          timer: 2000,
          showConfirmButton: false
        });
        setDocData({ name: "", specialization: "", email: "" });
        setIsCreate(false);
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.response?.data?.error || "Error Adding Doctor!",
      });
    }
  };

  const deleteDoctor = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/doctor/delete-doctor/${id}`);
          Swal.fire("Deleted!", "Doctor record has been removed.", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "Error Deleting Doctor!", "error");
        }
      }
    });
  };

  if (loading && doctors.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MedicalIcon color="primary" fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Manage Doctors
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreate(true)}
              sx={{ borderRadius: 2 }}
            >
              Add New Doctor
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Doctor Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Specialization</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.length > 0 ? (
                  doctors.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{item.doctorId || index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.specialization}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete Doctor">
                          <IconButton color="error" onClick={() => deleteDoctor(item._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No doctors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Add Doctor Dialog */}
      <Dialog
        open={isCreate}
        onClose={() => setIsCreate(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Doctor Entry</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Doctor Name"
              variant="outlined"
              value={docData.name}
              onChange={(e) => setDocData({ ...docData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={docData.email}
              onChange={(e) => setDocData({ ...docData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Specialization"
              variant="outlined"
              value={docData.specialization}
              onChange={(e) => setDocData({ ...docData, specialization: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsCreate(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddDoctor} variant="contained" sx={{ borderRadius: 2 }}>
            Register Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDoctor;
