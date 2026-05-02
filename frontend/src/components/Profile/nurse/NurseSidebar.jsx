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
  Medication as MedicationIcon,
  Message as MessageIcon,
  ExitToApp as LogoutIcon
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;

const NurseSidebar = ({ profilePic, userName }) => {
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
    { text: "Settings", icon: <SettingsIcon />, path: "/nurse-profile" },
    { text: "Medication", icon: <MedicationIcon />, path: "/nurse-medication" },
    { text: "Messages", icon: <MessageIcon />, path: "/nurse-bed" },
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
          alt={userName || "Nurse"}
          sx={{ width: 80, height: 80, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {userName || "Nurse"}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
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
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
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
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{ borderRadius: 2 }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default NurseSidebar;
