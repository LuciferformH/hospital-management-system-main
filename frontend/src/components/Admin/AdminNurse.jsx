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
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import {
  Add as AddIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import { getUserAvatar } from "../../utils/avatar";
import Loader from "../Shared/Loader";

function AdminNurse() {
  const [nurses, setNurses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);

  const [nurData, setNurData] = useState({
    name: "",
    email: "",
    department: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, nurseRes] = await Promise.all([
        api.get("/admin/get-department"),
        api.get("/nurse/get-nurses")
      ]);
      setDepartments(deptRes.data);
      setNurses(nurseRes.data);
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

  const handleAddNurse = async (e) => {
    e.preventDefault();
    if (!nurData.name || !nurData.email || !nurData.department) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    try {
      const res = await api.post("/nurse/add-nurse", nurData);
      if (res.data.message === "Success") {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Nurse Added Successfully!",
          timer: 2000,
          showConfirmButton: false
        });
        setNurData({ name: "", email: "", department: "" });
        setIsCreate(false);
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.response?.data?.error || "Error Adding Nurse!",
      });
    }
  };

  if (loading && nurses.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon color="primary" fontSize="large" />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Manage Nurses
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCreate(true)}
              sx={{ borderRadius: 2 }}
            >
              Add New Nurse
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>S No</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nurse Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nurses.length > 0 ? (
                  nurses.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email || "N/A"}</TableCell>
                      <TableCell>{item.department?.name || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No nurses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Add Nurse Dialog */}
      <Dialog
        open={isCreate}
        onClose={() => setIsCreate(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Nurse Entry</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nurse Name"
              variant="outlined"
              value={nurData.name}
              onChange={(e) => setNurData({ ...nurData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={nurData.email}
              onChange={(e) => setNurData({ ...nurData, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={nurData.department}
                label="Department"
                onChange={(e) => setNurData({ ...nurData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsCreate(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddNurse} variant="contained" sx={{ borderRadius: 2 }}>
            Register Nurse
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminNurse;
