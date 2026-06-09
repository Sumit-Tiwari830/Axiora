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
} from "@mui/icons-material";

const SideBar = () => {
    const location = useLocation();

    const activeStyle = {
        background: "rgba(255,255,255,0.15)",
        borderRadius: "12px",
        margin: "4px 8px",
    };

    const textStyle = {
        color: "#ffffff",
        fontWeight: 500,
    };

    return (
        <>
            <Box
                sx={{
                    textAlign: "center",
                    py: 3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "1px",
                    }}
                >
                    AXIORA </Typography>

                <Typography
                    sx={{
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "0.8rem",
                    }}
                >
                    School Management
                </Typography>
            </Box>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

            <ListItemButton
                component={Link}
                to="/Admin/dashboard"
                sx={
                    location.pathname === "/Admin/dashboard"
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <DashboardIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Dashboard"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/classes"
                sx={
                    location.pathname.startsWith("/Admin/classes")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <ClassOutlinedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Classes"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/subjects"
                sx={
                    location.pathname.startsWith("/Admin/subjects")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <AssignmentIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Subjects"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/teachers"
                sx={
                    location.pathname.startsWith("/Admin/teachers")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <SupervisorAccountOutlinedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Teachers"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/students"
                sx={
                    location.pathname.startsWith("/Admin/students")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <PersonOutlineIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Students"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/notices"
                sx={
                    location.pathname.startsWith("/Admin/notices")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <AnnouncementOutlinedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Notices"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/complains"
                sx={
                    location.pathname.startsWith("/Admin/complains")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <ReportIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Complaints"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Admin/addfee"
                sx={
                    location.pathname.startsWith("/Admin/addfee")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <PaymentIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Add Fee"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <Divider
                sx={{
                    my: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                }}
            />

            <ListSubheader
                sx={{
                    bgcolor: "transparent",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 700,
                }}
            >
                USER
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Admin/profile"
                sx={
                    location.pathname.startsWith("/Admin/profile")
                        ? activeStyle
                        : {}
                }
            >
                <ListItemIcon>
                    <AccountCircleOutlinedIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/logout"
            >
                <ListItemIcon>
                    <ExitToAppIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{ style: textStyle }}
                />
            </ListItemButton>
        </>


    );
};

export default SideBar;
