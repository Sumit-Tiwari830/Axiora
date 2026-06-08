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
import { Navigate, Route, Routes } from "react-router-dom";

import StudentSideBar from "./StudentSideBar";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import Logout from "../Logout";

import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

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