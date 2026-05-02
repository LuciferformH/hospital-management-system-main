import api from "../../../api/api";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from "../../../redux/UserSlice.js";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Button,
  Divider
} from "@mui/material";
import {
  Settings as SettingsIcon,
  History as HistoryIcon,
  AddCircle as BookIcon,
  Medication as MedicationIcon,
  ExitToApp as LogoutIcon
} from "@mui/icons-material";
import { getUserAvatar } from "../../../utils/avatar";

const DRAWER_WIDTH = 260;

const UserSidebar = ({ profilePic, userName }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await api.get("/auth/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        localStorage.removeItem("user");
        dispatch(logout());
        window.location.href = "/";
      }
    });
  };

  const menuItems = [
    { text: "Account Settings", icon: <SettingsIcon />, path: "/user-profile" },
    { text: "Appointment History", icon: <HistoryIcon />, path: "/user-appointments" },
    { text: "Book Appointment", icon: <BookIcon />, path: "/user-book-appointment" },
    { text: "My Medications", icon: <MedicationIcon />, path: "/user-medication" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #e0e0e0' },
      }}
    >
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={profilePic}
          alt={userName || "Patient"}
          sx={{ width: 90, height: 90, boxShadow: '0px 8px 15px rgba(0,0,0,0.1)' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
          {userName || "Patient"}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
          Patient Dashboard
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 45, color: isActive ? 'inherit' : 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{ borderRadius: 3, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default UserSidebar;
