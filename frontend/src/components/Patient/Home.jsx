
import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    TextField,
    Paper,
    Stack,
    Avatar,
    IconButton
} from '@mui/material';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Swal from "sweetalert2";
import api from "../../api/api";
import Footer from '../Shared/Footer';

// Assets
import banner from "../../assets/hero.png";
import service from "../../assets/services.png";
import feedback from "../../assets/feedback.png";
import review from "../../assets/review.jpg";
import human1 from "../../assets/human1.jpg";
import human4 from "../../assets/human4.jpg";
import human6 from "../../assets/human6.jpg";
import doct2 from "../../assets/doct2.jpg";

// Icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StarIcon from '@mui/icons-material/Star';

const doctorsList = [
    { img: human1, name: "Dr. Rahul Singh", role: "Surgeon" },
    { img: doct2, name: "Dr. Victor Suresh", role: "Surgeon" },
    { img: human4, name: "Dr. Selena Gomez", role: "Surgeon" },
    { img: human6, name: "Dr. Nilesh Mishra", role: "Surgeon" },
];

function Home() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [email, setEmail] = useState("");

    const handleNewsletter = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            await api.post("/admin/new-letter", { email });
            Swal.fire({
                title: "Success",
                icon: "success",
                confirmButtonText: "OK",
                text: "Thanks For Subscribing To The Newsletter!",
            });
            setEmail("");
        } catch (error) {
            Swal.fire({
                title: "Error",
                icon: "error",
                confirmButtonText: "OK",
                text: "Failed to subscribe!",
            });
        }
    }

    return (
        <Box sx={{ bgcolor: 'background.default', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <Box sx={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f4f7f6 0%, #e0f2f1 100%)',
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <Typography variant="h2" color="primary.dark" gutterBottom sx={{ fontWeight: 800 }}>
                                    The Power to Heal
                                </Typography>
                                <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.6 }}>
                                    Undertaking specialized and holistic healthcare services of world standards
                                    to provide them to all sections of society.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    href="/appointment"
                                    sx={{ fontSize: '1.1rem', py: 1.5, px: 4 }}
                                >
                                    Book Appointment
                                </Button>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <Box
                                    component="img"
                                    src={banner}
                                    alt="Hero Banner"
                                    sx={{
                                        width: '100%',
                                        maxHeight: 500,
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.1))'
                                    }}
                                />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Why Choose Us */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
                    Why Choose Us?
                </Typography>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Stack spacing={4}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <VerifiedUserIcon color="white" />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">Best Doctors</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Great doctors demonstrate professionalism through their ethical conduct, reliability, and accountability.
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <Avatar sx={{ bgcolor: 'secondary.light' }}>
                                        <ScienceIcon color="white" />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">Better Research</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Quality in clinical research is defined as compliance with requirements together with credibility of data.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
                        <Box component="img" src={service} alt="Services" sx={{ maxWidth: '100%', height: 'auto' }} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Stack spacing={4}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                                        <MedicalServicesIcon color="white" />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">Medical Staff</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Nurses are responsible for recognizing patients' symptoms and taking measures within their scope.
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <VerifiedUserIcon color="white" />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="bold">Emergency Care</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    24/7 emergency services provided by our dedicated team of professionals to ensure your safety.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            {/* Meet Our Specialist */}
            <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
                <Container maxWidth="lg" ref={ref}>
                    <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 700 }}>
                        Meet Our Specialists
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {doctorsList.map((doc, index) => (
                            <Grid item key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card sx={{ width: 280, borderRadius: 3, boxShadow: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                                            <Avatar
                                                src={doc.img}
                                                sx={{ width: 100, height: 100, boxShadow: 2 }}
                                            />
                                        </Box>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" component="div" fontWeight="bold">
                                                {doc.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {doc.role}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                href="/appointment"
                                                sx={{ mt: 2, borderRadius: 2 }}
                                            >
                                                Book Appointment
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Feedback & Newsletter */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Patient Feedback
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            A hospital is a healthcare institution providing patient treatment with specialized health science.
                        </Typography>
                        <Card sx={{ bgcolor: 'background.default', p: 3, borderRadius: 4, mt: 4 }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Avatar src={review} sx={{ width: 64, height: 64 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Ms. Ariana Grande</Typography>
                                    <Box sx={{ display: 'flex' }}>
                                        {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 20 }} />)}
                                    </Box>
                                </Box>
                            </Stack>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                "I have visited many hospitals but HMS has to be one of the finest anywhere in the world.
                                From the International desk to the private executive room, service has been excellent."
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)' }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Subscribe to our Newsletter
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Stay updated about the developments in the healthcare field.
                            </Typography>
                            <Box component="form" onSubmit={handleNewsletter} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ mb: 2, bgcolor: 'white' }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{ py: 1.5 }}
                                >
                                    Subscribe
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    )
}

export default Home;
