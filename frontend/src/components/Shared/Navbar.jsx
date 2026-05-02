import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Appointment', path: '/appointment' },
    { title: 'About Us', path: '/about-us' },
    { title: 'Contact Us', path: '/contact-us' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">HMS</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navLinks.map((item) => (
          <ListItem
            button
            key={item.title}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor: isActive(item.path) ? 'primary.light' : 'transparent',
              color: isActive(item.path) ? 'white' : 'text.primary',
              '&:hover': { bgcolor: 'primary.light', color: 'white' }
            }}
          >
            <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        ))}
        <ListItem sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => { navigate('/sign-in'); handleDrawerToggle(); }}
          >
            Login
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 80, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h4"
              fontWeight="800"
              component="div"
              sx={{
                cursor: 'pointer',
                background: 'linear-gradient(45deg, #00796b, #004c40)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              onClick={() => navigate('/')}
            >
              HMS
            </Typography>

            {/* Desktop Nav */}
            {!isMobile && (
              <Stack direction="row" spacing={3} alignItems="center">
                {navLinks.map((item) => (
                  <Button
                    key={item.title}
                    component={NavLink}
                    to={item.title === 'Home' ? '/' : item.path}
                    sx={{
                      fontWeight: isActive(item.title === 'Home' ? '/' : item.path) ? 700 : 500,
                      color: isActive(item.title === 'Home' ? '/' : item.path) ? 'primary.main' : 'text.secondary',
                      fontSize: '1rem',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'primary.main',
                      },
                      '&::after': isActive(item.title === 'Home' ? '/' : item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 5,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40%',
                        height: '3px',
                        backgroundColor: '#00796b',
                        borderRadius: '2px',
                      } : {}
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/sign-in')}
                  sx={{ borderRadius: 50, px: 4 }}
                >
                  Login
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Navbar;
