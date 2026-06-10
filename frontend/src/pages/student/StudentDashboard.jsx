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

    // Render the MeetingRoom fullscreen when navigated to /meeting/...
    if (location.pathname.startsWith("/meeting/")) {
        return (
            <Routes>
                <Route path="/meeting/:roomId" element={<MeetingRoom />} />
            </Routes>
        );
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Top Navbar */}
            <AppBar position="absolute" open={open}>
                <Toolbar sx={{ pr: 3 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            mr: 3,
                            ...(open && { display: "none" }),
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
                            fontWeight: 600,
                        }}
                    >
                        Student Dashboard
                    </Typography>

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
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                <Divider />

                <List component="nav">
                    <StudentSideBar />
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={styles.boxStyled}
            >
                <Toolbar />

                <Box sx={{ p: 3 }}>
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
            </Box>
            {/* Live Meeting Invite Dialog */}
            <Dialog open={!!meetingInvite} onClose={() => setMeetingInvite(null)}>
                <DialogTitle sx={{ fontWeight: 700, color: "#7c3aed" }}>
                    🔴 Live Class Started!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 1, color: "text.primary", fontWeight: 600 }}>
                        {meetingInvite?.teacher} has started a live class for {meetingInvite?.className}.
                    </DialogContentText>
                    <DialogContentText sx={{ mb: 1 }}>
                        <strong>Subject:</strong> {meetingInvite?.subject}
                    </DialogContentText>
                    <DialogContentText sx={{ mb: 1 }}>
                        <strong>Code:</strong> {meetingInvite?.code}
                    </DialogContentText>
                    <DialogContentText>
                        <strong>Password:</strong> {meetingInvite?.password}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setMeetingInvite(null)} color="inherit" sx={{ fontWeight: 600 }}>
                        Decline
                    </Button>
                    <Button
                        onClick={() => {
                            const invite = meetingInvite;
                            setMeetingInvite(null);
                            navigate(`/meeting/${invite.code}?pass=${invite.password}`);
                        }}
                        variant="contained"
                        color="secondary"
                        sx={{ fontWeight: 700 }}
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
        backgroundColor: (theme) =>
            theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        minHeight: "100vh",
        overflow: "auto",
    },

    toolBarStyled: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 1,
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