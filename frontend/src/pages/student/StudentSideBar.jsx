import React from "react";
import {
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import { Home as HomeIcon, ExitToApp as ExitToAppIcon, AccountCircleOutlined as AccountCircleOutlinedIcon, AnnouncementOutlined as AnnouncementOutlinedIcon, ClassOutlined as ClassOutlinedIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

const StudentSideBar = () => {
    const location = useLocation();

    const isHome =
        location.pathname === "/" ||
        location.pathname === "/Student/dashboard";

    return (
        <>
            {/* Main Navigation */}
            <ListItemButton
                component={Link}
                to="/Student/dashboard"
                selected={isHome}
            >
                <ListItemIcon>
                    <HomeIcon
                        color={isHome ? "primary" : "inherit"}
                    />
                </ListItemIcon>

                <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Student/subjects"
                selected={location.pathname.startsWith(
                    "/Student/subjects"
                )}
            >
                <ListItemIcon>
                    <AssignmentIcon
                        color={
                            location.pathname.startsWith(
                                "/Student/subjects"
                            )
                                ? "primary"
                                : "inherit"
                        }
                    />
                </ListItemIcon>

                <ListItemText primary="Subjects" />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Student/attendance"
                selected={location.pathname.startsWith(
                    "/Student/attendance"
                )}
            >
                <ListItemIcon>
                    <ClassOutlinedIcon
                        color={
                            location.pathname.startsWith(
                                "/Student/attendance"
                            )
                                ? "primary"
                                : "inherit"
                        }
                    />
                </ListItemIcon>

                <ListItemText primary="Attendance" />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/Student/complain"
                selected={location.pathname.startsWith(
                    "/Student/complain"
                )}
            >
                <ListItemIcon>
                    <AnnouncementOutlinedIcon
                        color={
                            location.pathname.startsWith(
                                "/Student/complain"
                            )
                                ? "primary"
                                : "inherit"
                        }
                    />
                </ListItemIcon>

                <ListItemText primary="Complaints" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* User Section */}
            <ListSubheader component="div" inset>
                User
            </ListSubheader>

            <ListItemButton
                component={Link}
                to="/Student/profile"
                selected={location.pathname.startsWith(
                    "/Student/profile"
                )}
            >
                <ListItemIcon>
                    <AccountCircleOutlinedIcon
                        color={
                            location.pathname.startsWith(
                                "/Student/profile"
                            )
                                ? "primary"
                                : "inherit"
                        }
                    />
                </ListItemIcon>

                <ListItemText primary="Profile" />
            </ListItemButton>

            <ListItemButton
                component={Link}
                to="/logout"
                selected={location.pathname.startsWith(
                    "/logout"
                )}
            >
                <ListItemIcon>
                    <ExitToAppIcon
                        color={
                            location.pathname.startsWith(
                                "/logout"
                            )
                                ? "primary"
                                : "inherit"
                        }
                    />
                </ListItemIcon>

                <ListItemText primary="Logout" />
            </ListItemButton>
        </>
    );
};

export default StudentSideBar;