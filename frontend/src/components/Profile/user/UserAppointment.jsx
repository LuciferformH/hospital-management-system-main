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
  Chip,
  Avatar
} from "@mui/material";
import {
  History as HistoryIcon,
  EventNote as EventIcon,
  Person as DoctorIcon
} from "@mui/icons-material";
import profiePic from "../../../assets/human6.jpg";
import api from "../../../api/api";
import Swal from "sweetalert2";
import UserSidebar from "./UserSidebar";
import Loader from "../../Shared/Loader";

function UserAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [userData, setuserData] = useState({});
  const [loading, setLoading] = useState(true);

  const getStatusChip = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "scheduled":
        return <Chip label="Scheduled" color="warning" size="small" sx={{ fontWeight: 600 }} />;
      case "inprogress":
        return <Chip label="In Progress" color="info" size="small" sx={{ fontWeight: 600 }} />;
      case "completed":
        return <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status || "Unknown"} size="small" />;
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setuserData(user);
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/appointment/get-appointments/${user.email}`);
          setAppointments(res.data);
        } catch (err) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Error Fetching Appointments! Please Try Again!",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, []);

  if (loading && appointments.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <UserSidebar profiePic={profiePic} userName={userData.userName} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <HistoryIcon />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Appointment History
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Doctor</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    const formattedDate = appointmentDate.toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <TableRow key={appointment._id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DoctorIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600}>
                              Dr. {appointment.doctor.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon fontSize="small" color="action" />
                            <Typography variant="body2">{formattedDate}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" color="text.secondary" noWrap title={appointment.reason}>
                            {appointment.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(appointment.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No appointment history found.
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Your future appointments will appear here.
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

export default UserAppointment;
