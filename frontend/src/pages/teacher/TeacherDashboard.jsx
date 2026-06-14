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
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    color: '#0f172a',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
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

                    <Typography
                        component="h1"
                        variant="h6"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            color: '#0f172a',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Teacher Portal
                    </Typography>

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
        background: '#f0f2f8',
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