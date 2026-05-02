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
  Mail as MailIcon,
  MarkEmailRead as EmailReadIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import profiePic from "../../assets/human6.jpg";
import Loader from "../Shared/Loader";

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSentMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/get-sent-newsletter");
      setSubscribers(res.data);
    } catch (err) {
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
    fetchSentMessages();
  }, []);

  if (loading && subscribers.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} profiePic={profiePic} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MailIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Newsletter Subscribers
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'info.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600, width: '10%' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Subscriber's Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, width: '20%' }} align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers.length > 0 ? (
                  subscribers.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.light' }}>
                            <MailIcon fontSize="small" />
                          </Avatar>
                          {item.email}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.main', gap: 0.5 }}>
                          <EmailReadIcon fontSize="small" />
                          <Typography variant="caption" fontWeight={700}>SUBSCRIBED</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      No subscribers found.
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

export default AdminNewsletter;
