import React, { useState, useEffect } from "react";
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
    Chip
} from "@mui/material";
import {
    CalendarMonth as AppointmentIcon,
    EventNote as EventIcon
} from "@mui/icons-material";
import api from "../../../api/api";
import DoctorSidebar from "./DoctorSidebar";
import { useSelector } from "react-redux";
import profiePic from "../../../assets/doct2.jpg";
import Loader from "../../Shared/Loader";

function DoctorAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(
                    `/appointment/get-appointment/${currentUser._id}`
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser._id]);

    const getStatusChip = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed') return <Chip label="Completed" color="success" size="small" />;
        if (s === 'pending') return <Chip label="Pending" color="warning" size="small" />;
        if (s === 'cancelled') return <Chip label="Cancelled" color="error" size="small" />;
        return <Chip label={status || 'Unknown'} size="small" />;
    };

    if (loading && appointments.length === 0) {
        return <Loader />;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <DoctorSidebar userName={currentUser.name} profiePic={profiePic} />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AppointmentIcon color="primary" fontSize="large" />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Recent Appointments
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'primary.main' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient Name</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Time</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(appointments) && appointments.length > 0 ? (
                                    appointments.map((item, index) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                                            <TableCell>{item.patient}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EventIcon fontSize="inherit" color="action" />
                                                    {item.appointmentDate}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{item.time}</TableCell>
                                            <TableCell>{getStatusChip(item.status)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                You have no scheduled appointments at this time.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </Box>
        </Box>
    );
}

export default DoctorAppointment;
