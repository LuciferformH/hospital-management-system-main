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
    Delete as DeleteIcon,
    LocalHospital as HospitalIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import Loader from "../Shared/Loader";
import AdminSidebar from "./AdminSidebar";
import profiePic from "../../assets/human6.jpg";

function AdminDepartment() {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreate, setIsCreate] = useState(false);

    const [deptData, setDeptData] = useState({
        name: "",
        description: "",
        head: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [deptRes, docRes] = await Promise.all([
                api.get("/admin/get-department"),
                api.get("/doctor/get-doctors"),
            ]);
            setDepartments(deptRes.data);
            setDoctors(docRes.data);
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

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        if (!deptData.name) {
            return Swal.fire("Error", "Department name is required", "error");
        }
        try {
            const response = await api.post("/admin/add-department", deptData);
            if (response.status === 200) {
                Swal.fire("Success", "Department Added Successfully!", "success");
                setDeptData({ name: "", description: "", head: "" });
                setIsCreate(false);
                fetchData();
            }
        } catch (error) {
            Swal.fire("Error", error.response?.data?.error || "Error Adding Department!", "error");
        }
    };

    const deleteDepartment = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/delete-department/${id}`);
                    Swal.fire("Deleted!", "Department has been removed.", "success");
                    fetchData();
                } catch (error) {
                    Swal.fire("Error", "Error Deleting Department!", "error");
                }
            }
        });
    };

    if (loading && departments.length === 0) {
        return <Loader />;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AdminSidebar userName={"Admin"} profiePic={profiePic} />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <HospitalIcon color="primary" fontSize="large" />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                Hospital Departments
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreate(true)}
                            sx={{ borderRadius: 2 }}
                        >
                            Add Department
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'primary.main' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Department Name</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Head of Dept</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {departments.length > 0 ? (
                                    departments.map((item, index) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                                            <TableCell>{item.head?.name || "N/A"}</TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                <Typography variant="body2" noWrap title={item.description}>
                                                    {item.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Delete Department">
                                                    <IconButton color="error" onClick={() => deleteDepartment(item._id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            No departments found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>

            {/* Add Department Dialog */}
            <Dialog
                open={isCreate}
                onClose={() => setIsCreate(false)}
                PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 450 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Add New Hospital Department</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            variant="outlined"
                            required
                            value={deptData.name}
                            onChange={(e) => setDeptData({ ...deptData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            value={deptData.description}
                            onChange={(e) => setDeptData({ ...deptData, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Head of Department</InputLabel>
                            <Select
                                value={deptData.head}
                                label="Head of Department"
                                onChange={(e) => setDeptData({ ...deptData, head: e.target.value })}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {doctors.map((doc) => (
                                    <MenuItem key={doc._id} value={doc._id}>
                                        {doc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsCreate(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddDepartment} variant="contained" sx={{ borderRadius: 2 }}>
                        Create Department
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AdminDepartment;
