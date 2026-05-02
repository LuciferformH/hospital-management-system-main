import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar
} from "@mui/material";
import {
  MedicalServices as MedicalIcon,
  People as PeopleIcon,
  QuestionAnswer as QueryIcon,
  LocalHospital as HospitalIcon,
  TrendingUp as TrendingIcon
} from "@mui/icons-material";
import api from "../../api/api";
import Swal from "sweetalert2";
import AdminSidebar from "./AdminSidebar";
import { getUserAvatar } from "../../utils/avatar";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    doccou: 0,
    nursecou: 0,
    patientcou: 0,
    queriescou: 0,
    deptcou: 0
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get("/admin/get-count");
        setCounts(res.data);
      } catch (err) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Error Fetching Data!",
        });
      }
    };
    fetchInfo();
  }, []);

  const statCards = [
    { title: "Doctors", count: counts.doccou, icon: <MedicalIcon fontSize="large" />, color: "#2196f3" },
    { title: "Nurses", count: counts.nursecou, icon: <PeopleIcon fontSize="large" />, color: "#4caf50" },
    { title: "Patients", count: counts.patientcou, icon: <PeopleIcon fontSize="large" />, color: "#ff9800" },
    { title: "Queries", count: counts.queriescou, icon: <QueryIcon fontSize="large" />, color: "#f44336" },
    { title: "Departments", count: counts.deptcou, icon: <HospitalIcon fontSize="large" />, color: "#9c27b0" },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar userName={"Admin"} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingIcon color="primary" fontSize="large" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Dashboard Overview
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Card sx={{
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      width: 60,
                      height: 60,
                      mr: 2
                    }}>
                      {card.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {card.count}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
