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
  Avatar
} from "@mui/material";
import {
  People as PeopleIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import Loader from "../Shared/Loader";
import { getUserAvatar } from "../../utils/avatar";

function AdminPatient() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/admin/get-users");
        setUsers(response.data);
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

    fetchData();
  }, []);

  if (loading && users.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <PeopleIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Patient List
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'secondary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            src={getUserAvatar({ name: item.userName, email: item.email })}
                            sx={{ width: 32, height: 32 }}
                          />
                          {item.userName}
                        </Box>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: 'info.light',
                            color: 'info.contrastText',
                            px: 1, py: 0.5,
                            borderRadius: 1,
                            textTransform: 'uppercase',
                            fontWeight: 700
                          }}
                        >
                          {item.role}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No patients found.
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

export default AdminPatient;
