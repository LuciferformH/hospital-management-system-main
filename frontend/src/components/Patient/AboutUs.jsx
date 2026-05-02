import React, { useState } from 'react';
import Navbar from '../Shared/Navbar';
import banner from '../../assets/AboutUs.jpg';
import slide1 from '../../assets/slide2.jpg';
import slide2 from '../../assets/slide3.jpg';
import slide3 from '../../assets/slide4.jpg';
import slide4 from '../../assets/slide5.jpg';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Box, Container, Typography, Grid, Paper, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function AboutUs() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const slideImages = [slide1, slide2, slide3, slide4];
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? slideImages.length - 1 : current - 1);
  };
  const nextSlide = () => {
    setCurrent(current === slideImages.length - 1 ? 0 : current + 1);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* Banner Section */}
      <Box sx={{ position: 'relative', height: { xs: '50vh', md: '80vh' }, overflow: 'hidden' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ height: '100%', width: '100%' }}
        >
          <Box
            component="img"
            src={banner}
            alt="About Us Banner"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: { md: '10%' },
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              p: 4,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              display: { xs: 'none', lg: 'block' }
            }}
          >
            <Typography variant="h3" color="primary.dark" fontWeight="bold">About HMS</Typography>
          </Box>
        </motion.div>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                Background
              </Typography>
              <Typography paragraph variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                HMS is a quaternary care hospital network offering end-to-end healthcare services, right from primary to quaternary care.
                HMS Hospital is owned and managed by M/s HMS Health Care Management Limited, providing world-class affordable healthcare services
                since 1999. Currently, the Company delivers quality healthcare through a wide network of multi-specialty hospitals.
              </Typography>
              <Typography paragraph variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                HMS has pioneered the quality revolution in the field of healthcare delivery in the country, making quality healthcare
                affordable and accessible to everyone. The Blood Center is accredited by NABH and the laboratory is NABL accredited.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, bgcolor: 'primary.light', color: 'white', borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Group Chairman's Message
                </Typography>
                <Typography variant="h6" gutterBottom fontStyle="italic">
                  - Dr. M.I. Sahadulla
                </Typography>
                <Typography paragraph variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  "HMS has been revolutionizing the art of healthcare delivery through its focus on quality, patient safety and ethical practices.
                  We strive to deliver quality care balancing the high expectations of patients and the increasing cost of medical technology.
                  Thus, HMS touches upon all aspects of wellness and healthcare, with a fine fusion of cardinal principles of holistic care
                  and hospitality with the three-pronged approach of courtesy, compassion, and competence."
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Gallery Section */}
      <Box sx={{ bgcolor: 'secondary.main', py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
            Image Gallery
          </Typography>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, mx: 'auto', height: 400, borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
            {slideImages.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`Slide ${index}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: index === current ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
            ))}

            <IconButton
              onClick={prevSlide}
              sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default AboutUs;
