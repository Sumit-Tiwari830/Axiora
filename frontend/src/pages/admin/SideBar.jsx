import * as React from "react";
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

import {
    Dashboard as DashboardIcon,
    PersonOutline as PersonOutlineIcon,
    ExitToApp as ExitToAppIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    AnnouncementOutlined as AnnouncementOutlinedIcon,
    ClassOutlined as ClassOutlinedIcon,
    SupervisorAccountOutlined as SupervisorAccountOutlinedIcon,
    Report as ReportIcon,
    Assignment as AssignmentIcon,
    Payment as PaymentIcon,
    VideoCallOutlined as VideoCallOutlinedIcon,
    SchoolOutlined as SchoolOutlinedIcon,
} from "@mui/icons-material";

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

const SideBar = () => {
    const location = useLocation();

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
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
                    School Management
                </Typography>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />

            {/* Section: Management */}
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
                Management
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Admin/dashboard"
                sx={navItemSx(isActive('/Admin/dashboard', true) || location.pathname === '/')}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/dashboard', true) || location.pathname === '/')}>
                    <DashboardIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/dashboard', true) || location.pathname === '/') }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/classes"
                sx={navItemSx(isActive('/Admin/classes'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/classes'))}>
                    <ClassOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Classes"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/classes')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/subjects"
                sx={navItemSx(isActive('/Admin/subjects'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/subjects'))}>
                    <AssignmentIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Subjects"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/subjects')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/teachers"
                sx={navItemSx(isActive('/Admin/teachers'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/teachers'))}>
                    <SupervisorAccountOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Teachers"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/teachers')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/students"
                sx={navItemSx(isActive('/Admin/students'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/students'))}>
                    <PersonOutlineIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Students"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/students')) }}
                />
            </ListItemButton>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mx: 2, my: 1 }} />

            {/* Section: Academic */}
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
                Academic
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Admin/notices"
                sx={navItemSx(isActive('/Admin/notices'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/notices'))}>
                    <AnnouncementOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Notices"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/notices')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/complains"
                sx={navItemSx(isActive('/Admin/complains'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/complains'))}>
                    <ReportIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Complaints"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/complains')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/fees"
                sx={navItemSx(isActive('/Admin/fees'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/fees'))}>
                    <PaymentIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Fees"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/fees')) }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/meeting"
                sx={navItemSx(isActive('/Admin/meeting'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/meeting'))}>
                    <VideoCallOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Live Class"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/meeting')) }}
                />
            </ListItemButton>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', mx: 2, my: 1 }} />

            {/* Section: System */}
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
                System
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Admin/profile"
                sx={navItemSx(isActive('/Admin/profile'))}
            >
                <ListItemIcon sx={iconSx(isActive('/Admin/profile'))}>
                    <AccountCircleOutlinedIcon fontSize="inherit" />
                </ListItemIcon>
                <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ sx: textSx(isActive('/Admin/profile')) }}
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

export default SideBar;
