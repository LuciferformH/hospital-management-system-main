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
  IconButton,
  Tooltip,
  Chip
} from "@mui/material";
import {
  QuestionAnswer as QueryIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import Loader from "../Shared/Loader";
import profiePic from "../../assets/human6.jpg";

function AdminQuery() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/get-contacts");
      setContacts(response.data);
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

  const deleteQuery = async (id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to remove this query?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Remove"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Assuming there's a delete endpoint matching the pattern
          await api.delete(`/admin/delete-contact/${id}`);
          Swal.fire("Removed!", "Query has been deleted.", "success");
          fetchData();
        } catch (err) {
          Swal.fire("Error", "Error Deleting Query!", "error");
        }
      }
    });
  };

  if (loading && contacts.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} profiePic={profiePic} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <QueryIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Patient Enquiries
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'secondary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient Details</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Message</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700}>{item.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <EmailIcon fontSize="inherit" color="action" />
                          <Typography variant="caption" color="text.secondary">{item.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="inherit" color="action" />
                          <Typography variant="caption" color="text.secondary">{item.phone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 400 }}>
                        <Typography variant="body2">{item.message}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete Query">
                          <IconButton color="error" onClick={() => deleteQuery(item._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No enquiries found.
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

export default AdminQuery;
