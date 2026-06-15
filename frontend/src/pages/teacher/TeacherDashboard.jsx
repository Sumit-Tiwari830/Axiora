import { useState } from "react";
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from "@mui/material";

import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import TeacherSideBar from "./TeacherSideBar";
import TeacherHomePage from "./TeacherHomePage";
import TeacherProfile from "./TeacherProfile";
import TeacherClassDetails from "./TeacherClassDetails";
import TeacherViewStudent from "./TeacherViewStudent";
import TeacherComplain from "./TeacherComplain";
import TeacherMeeting from "./TeacherMeeting";
import MeetingRoom from "../../pages/MeetingRoom";

import StudentAttendance from "../admin/studentRelated/StudentAttendance";
import StudentExamMarks from "../admin/studentRelated/StudentExamMarks";

import Logout from "../Logout";

import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";

const TeacherDashboard = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === "/" || path === "/Teacher/dashboard") return "Dashboard";
        if (path.startsWith("/Teacher/class/student")) return "Classroom / Student Profile";
        if (path.startsWith("/Teacher/class")) return "Classroom";
        if (path.startsWith("/Teacher/liveclass") || path.startsWith("/Teacher/meeting")) return "Live Class";
        if (path.startsWith("/Teacher/complain")) return "Complaints";
        if (path.startsWith("/Teacher/profile")) return "Profile";
        return "Portal";
    };

    if (location.pathname.startsWith("/meeting/")) {
        return (
            <Routes>
                <Route path="/meeting/:roomId" element={<MeetingRoom />} />
            </Routes>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: '#0f172a',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                }}
            >
                <Toolbar sx={{ pr: "24px", minHeight: { xs: 64 } }}>
                    <IconButton
                        edge="start"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            mr: 3,
                            color: '#4f46e5',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: 'rgba(79, 70, 229, 0.08)',
                                transform: 'scale(1.05)',
                            },
                            ...(open && {
                                display: "none",
                            }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#64748b',
                            }}
                        >
                            Teacher Portal
                        </Typography>
                        <Typography sx={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>/</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#0f172a',
                            }}
                        >
                            {getBreadcrumbs()}
                        </Typography>
                    </Box>

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={open}
                sx={
                    open
                        ? styles.drawerStyled
                        : styles.hideDrawer
                }
            >
                <Toolbar sx={styles.toolBarStyled}>
                    <IconButton
                        onClick={toggleDrawer}
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                                color: '#ffffff',
                                background: 'rgba(255,255,255,0.1)',
                            },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                <List component="nav" sx={{ px: 0.5 }}>
                    <TeacherSideBar />
                </List>
            </Drawer>

            <Box
                component="main"
                sx={styles.boxStyled}
            >
                <Toolbar />

                <Routes>
                    <Route
                        path="/"
                        element={<TeacherHomePage />}
                    />

                    <Route
                        path="/Teacher/dashboard"
                        element={<TeacherHomePage />}
                    />

                    <Route
                        path="/Teacher/profile"
                        element={<TeacherProfile />}
                    />

                    <Route
                        path="/Teacher/class"
                        element={<TeacherClassDetails />}
                    />

                    <Route
                        path="/Teacher/meeting"
                        element={<TeacherMeeting />}
                    />

                    <Route
                        path="/Teacher/class/student/:id"
                        element={<TeacherViewStudent />}
                    />

                    <Route
                        path="/Teacher/class/student/attendance/:studentID/:subjectID"
                        element={
                            <StudentAttendance
                                situation="Subject"
                            />
                        }
                    />

                    <Route
                        path="/Teacher/class/student/marks/:studentID/:subjectID"
                        element={
                            <StudentExamMarks
                                situation="Subject"
                            />
                        }
                    />

                    <Route
                        path="/Teacher/complain"
                        element={<TeacherComplain />}
                    />

                    <Route
                        path="/logout"
                        element={<Logout />}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;

const styles = {
    boxStyled: {
        background: '#f8fafc',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        padding: '24px',
        transition: 'all 0.3s ease',
    },

    toolBarStyled: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 1,
        background: 'transparent',
    },

    drawerStyled: {
        display: "flex",
    },

    hideDrawer: {
        display: "flex",

        "@media (max-width:600px)": {
            display: "none",
        },
    },
};