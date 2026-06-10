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
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar position="absolute" open={open}>
                <Toolbar sx={{ pr: "24px" }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: "36px",
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
                        color="inherit"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                        }}
                    >
                        Teacher Dashboard
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
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                <Divider />

                <List component="nav">
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
        backgroundColor: (theme) =>
            theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },

    toolBarStyled: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: [1],
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