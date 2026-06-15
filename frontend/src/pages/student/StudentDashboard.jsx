import React, { useState, useEffect } from "react";
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import StudentSideBar from "./StudentSideBar";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import StudentAskDoubt from "./StudentAskDoubt";
import StudentFee from "./StudentFee";
import Logout from "../Logout";
import MeetingRoom from "../../pages/MeetingRoom";

import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const [meetingInvite, setMeetingInvite] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === "/" || path === "/Student/dashboard") return "Dashboard";
        if (path.startsWith("/Student/profile")) return "Profile";
        if (path.startsWith("/Student/subjects")) return "Subjects";
        if (path.startsWith("/Student/attendance")) return "Attendance";
        if (path.startsWith("/Student/complain")) return "Complaints";
        if (path.startsWith("/Student/ask-doubt")) return "AI Doubt Solver";
        if (path.startsWith("/Student/fees")) return "Fees";
        return "Portal";
    };

    // Socket.io: Listen for meeting invitations from teacher
    useEffect(() => {
        if (!currentUser) return;

        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/api";
        const socketUrl = baseUrl.replace("/api", "").replace(/\/$/, "");
        const socket = io(socketUrl);

        socket.on("receive-meeting-invite", ({ targetStudentIds, classId, meetingDetails }) => {
            const isTargeted = targetStudentIds.length === 0 || targetStudentIds.includes(currentUser._id);
            const isSameClass = !classId || classId === currentUser?.sclassName?._id;

            if (isTargeted && isSameClass) {
                setMeetingInvite(meetingDetails);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [currentUser]);

    // Render the MeetingRoom fullscreen when navigated to /meeting/..
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

            {/* Top Navbar */}
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
                <Toolbar sx={{ pr: '24px', minHeight: { xs: 64 } }}>
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
                            ...(open && { display: "none" }),
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
                            Student Portal
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

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                open={open}
                sx={open ? styles.drawerStyled : styles.hideDrawer}
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
                    <StudentSideBar />
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={styles.boxStyled}
            >
                <Toolbar />

                <Routes>
                    <Route
                        path="/"
                        element={<StudentHomePage />}
                    />

                    <Route
                        path="/Student/dashboard"
                        element={<StudentHomePage />}
                    />

                    <Route
                        path="/Student/profile"
                        element={<StudentProfile />}
                    />

                    <Route
                        path="/Student/subjects"
                        element={<StudentSubjects />}
                    />

                    <Route
                        path="/Student/attendance"
                        element={<ViewStdAttendance />}
                    />

                    <Route
                        path="/Student/complain"
                        element={<StudentComplain />}
                    />

                    <Route
                        path="/Student/ask-doubt"
                        element={<StudentAskDoubt />}
                    />

                    <Route
                        path="/Student/fees"
                        element={<StudentFee />}
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

            {/* Live Meeting Invite Dialog */}
            <Dialog
                open={!!meetingInvite}
                onClose={() => setMeetingInvite(null)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(124, 58, 237, 0.15)',
                        overflow: 'hidden',
                    },
                }}
            >
                <Box
                    sx={{
                        height: 4,
                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4)',
                    }}
                />
                <DialogTitle sx={{
                    fontWeight: 700,
                    color: "#7c3aed",
                    fontSize: '1.25rem',
                    pt: 3,
                }}>
                    🔴 Live Class Started!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1.5, color: "text.primary", fontWeight: 600, fontSize: '0.95rem' }}>
                        {meetingInvite?.teacher} has started a live class for {meetingInvite?.className}.
                    </DialogContentText>
                    <DialogContentText sx={{ mb: 1, color: 'text.secondary' }}>
                        <strong>Subject:</strong> {meetingInvite?.subject}
                    </DialogContentText>
                    <DialogContentText sx={{ mb: 1, color: 'text.secondary' }}>
                        <strong>Code:</strong> {meetingInvite?.code}
                    </DialogContentText>
                    <DialogContentText sx={{ color: 'text.secondary' }}>
                        <strong>Password:</strong> {meetingInvite?.password}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        onClick={() => setMeetingInvite(null)}
                        color="inherit"
                        sx={{
                            fontWeight: 600,
                            borderRadius: '10px',
                            px: 2.5,
                            textTransform: 'none',
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={() => {
                            const invite = meetingInvite;
                            setMeetingInvite(null);
                            navigate(`/meeting/${invite.code}?pass=${invite.password}`);
                        }}
                        variant="contained"
                        sx={{
                            fontWeight: 700,
                            borderRadius: '10px',
                            px: 3,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3730a3, #5b21b6)',
                                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.45)',
                            },
                        }}
                    >
                        Join Class
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentDashboard;

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