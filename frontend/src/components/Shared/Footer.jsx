import React from 'react';
import { Box, Container, Typography, Link, IconButton, Grid, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, GitHub } from '@mui/icons-material';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: 6,
                borderTop: '1px solid',
                borderColor: 'divider',
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" color="primary" component="div" sx={{ fontWeight: 700 }}>
                                HMS
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Hospital Management System - Providing world-class healthcare solutions with efficient management and care.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
                            <Link href="#" color="text.secondary" underline="hover">Privacy Policy</Link>
                            <Link href="#" color="text.secondary" underline="hover">Terms of Service</Link>
                            <Link href="#" color="text.secondary" underline="hover">Contact Us</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Box>
                            <IconButton color="primary" href="#" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="primary" href="#" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="primary" href="#" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="primary" href="#" aria-label="GitHub">
                                <GitHub />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        HMS
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
