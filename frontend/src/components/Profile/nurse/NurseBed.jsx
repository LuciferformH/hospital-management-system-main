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
  Avatar,
  Chip
} from "@mui/material";
import {
  Message as MessageIcon,
  RecordVoiceOver as VoiceIcon
} from "@mui/icons-material";
import profilePic from "../../../assets/doct5.jpg";
import api from "../../../api/api";
import NurseSidebar from "./NurseSidebar";
import { useSelector } from "react-redux";
import Loader from "../../Shared/Loader";

function NurseBed() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/doctor/get-message/${currentUser.email}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser.email]);

  if (loading && messages.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <NurseSidebar profilePic={profilePic} userName={currentUser.name} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MessageIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Instructions from Doctors
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'info.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600, width: '10%' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, width: '25%' }}>From Doctor</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Message / Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((item, index) => (
                    <TableRow key={item._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                            <VoiceIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={700}>{item.from}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {item.message}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Your inbox is currently empty.
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

export default NurseBed;
