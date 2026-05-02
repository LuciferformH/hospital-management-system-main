import React, { useEffect, useState } from 'react'
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
  Divider
} from "@mui/material";
import {
  Medication as MedicationIcon,
  Healing as HealingIcon
} from "@mui/icons-material";
import profiePic from '../../../assets/human6.jpg'
import UserSidebar from './UserSidebar'
import api from '../../../api/api';
import Loader from "../../Shared/Loader";

function UserMedication() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.email) return;
      setLoading(true);
      try {
        const response = await api.get(`/user/get-medications/${userData.email}`);

        // Processing the nested array structure from the response
        const data = response.data;
        const medicationsArray = data.map(({ medications }) => medications);
        const detailsArray = medicationsArray.map(meds =>
          meds.map(({ name, dosage, frequency }) => ({ name, dosage, frequency }))
        );

        setMedicines(detailsArray);
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.email]);

  if (loading && medicines.length === 0) {
    return <Loader />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <UserSidebar profiePic={profiePic} userName={userData?.userName} />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
              <MedicationIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                My Medications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your prescribed medicines and dosage instructions.
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'info.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600, width: '10%' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Medicine Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Dosage</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicines.length > 0 ? (
                  medicines.map((medGroup, index) => (
                    // In the existing code, it seems the response structure is an array of arrays
                    // We take the first element of each subgroup for now as per original logic
                    <TableRow key={index} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.light' }}>
                            <HealingIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {medGroup[0]?.name || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{medGroup[0]?.dosage || "N/A"}</TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: 'info.light',
                            color: 'info.contrastText',
                            px: 1, py: 0.5,
                            borderRadius: 1,
                            fontWeight: 700
                          }}
                        >
                          {medGroup[0]?.frequency || "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No medications have been prescribed yet.
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
  )
}

export default UserMedication;
