import React from "react";
import {
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
    Box,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    Home as HomeIcon,
    ExitToApp as ExitToAppIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    AnnouncementOutlined as AnnouncementOutlinedIcon,
    ClassOutlined as ClassOutlinedIcon,
    VideoCallOutlined as VideoCallOutlinedIcon,
    SchoolOutlined as SchoolOutlinedIcon,
} from '@mui/icons-material';

const navItemSx = (isActive) => ({
    borderRadius: '10px',
    mx: 1,
    mb: 0.5,
    py: 1,
    px: 1.5,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    ...(isActive
        ? {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3px',
                height: '60%',
                borderRadius: '0 4px 4px 0',
                background: '#06b6d4',
            },
        }
        : {
            '&:hover': {
                background: 'rgba(255, 255, 255, 0.08)',
            },
        }),
});

const iconSx = (isActive) => ({
    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
    fontSize: '1.3rem',
    transition: 'all 0.2s ease',
    minWidth: 40,
});

const textSx = (isActive) => ({
    color: '#ffffff',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
});

const TeacherSideBar = () => {
    const location = useLocation();

    const { currentUser } = useSelector(
        (state) => state.user
    );

    const className =
        currentUser?.teachSclass?.sclassName ||
        "Not Assigned";

    const isHome =
        location.pathname === "/" ||
        location.pathname === "/Teacher/dashboard";

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Logo Area */}
            <Box
                sx={{
                    textAlign: 'center',
                    py: 2.5,
                    px: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 0.5,
                    }}
                >
                    <SchoolOutlinedIcon sx={{ color: '#06b6d4', fontSize: '1.8rem' }} />
                    <Typography
                        sx={{
                            fontSize: '1.6rem',
                            fontWeight: 800,
                            color: '#ffffff',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        AXIORA
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                    }}
                >
                    Teacher Portal
                </Typography>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

            {/* Section: Main */}
            <ListSubheader
                sx={{
                    bgcolor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    pt: 2.5,
                    pb: 1,
                    px: 3,
                }}
            >
                Main
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Teacher/dashboard"
                sx={navItemSx(isHome)}
            >
                <ListItemIcon sx={iconSx(isHome)}>
                    <HomeIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{ sx: textSx(isHome) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Teacher/class"
                sx={navItemSx(isActive("/Teacher/class"))}
            >
                <ListItemIcon sx={iconSx(isActive("/Teacher/class"))}>
                    <ClassOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary={`Class ${className}`}
                    primaryTypographyProps={{ sx: textSx(isActive("/Teacher/class")) }}
                />
            </ListItemButton>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mx: 2, my: 1 }} />

            {/* Section: Tools */}
            <ListSubheader
                sx={{
                    bgcolor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    pt: 1.5,
                    pb: 1,
                    px: 3,
                }}
            >
                Tools
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Teacher/meeting"
                sx={navItemSx(isActive("/Teacher/meeting"))}
            >
                <ListItemIcon sx={iconSx(isActive("/Teacher/meeting"))}>
                    <VideoCallOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Live Class"
                    primaryTypographyProps={{ sx: textSx(isActive("/Teacher/meeting")) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Teacher/complain"
                sx={navItemSx(isActive("/Teacher/complain"))}
            >
                <ListItemIcon sx={iconSx(isActive("/Teacher/complain"))}>
                    <AnnouncementOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Complaints"
                    primaryTypographyProps={{ sx: textSx(isActive("/Teacher/complain")) }}
                />
            </ListItemButton>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mx: 2, my: 1 }} />

            {/* Section: Account */}
            <ListSubheader
                sx={{
                    bgcolor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    pt: 1.5,
                    pb: 1,
                    px: 3,
                }}
            >
                Account
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Teacher/profile"
                sx={navItemSx(isActive("/Teacher/profile"))}
            >
                <ListItemIcon sx={iconSx(isActive("/Teacher/profile"))}>
                    <AccountCircleOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ sx: textSx(isActive("/Teacher/profile")) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/logout"
                sx={{
                    ...navItemSx(false),
                    '&:hover': {
                        background: 'rgba(239, 68, 68, 0.15)',
                    },
                }}
            >
                <ListItemIcon sx={{ ...iconSx(false), color: 'rgba(255, 255, 255, 0.5)' }}>
                    <ExitToAppIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ sx: { ...textSx(false), color: 'rgba(255, 255, 255, 0.7)' } }}
                />
            </ListItemButton>
        </>
    );
};

export default TeacherSideBar;