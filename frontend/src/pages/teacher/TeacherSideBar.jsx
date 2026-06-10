import React from "react";
import {
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Home as HomeIcon, ExitToApp as ExitToAppIcon, AccountCircleOutlined as AccountCircleOutlinedIcon, AnnouncementOutlined as AnnouncementOutlinedIcon, ClassOutlined as ClassOutlinedIcon, VideoCallOutlined as VideoCallOutlinedIcon } from '@mui/icons-material';

const TeacherSideBar = () => {
    const location = useLocation();

    const { currentUser } = useSelector(
        (state) => state.user
    );

    const className =
        currentUser?.teachSclass?.sclassName ||
        "Not Assigned";

    return (
        <>
            <React.Fragment>
                <ListItemButton
                    component={Link}
                    to="/Teacher/dashboard"
                >
                    <ListItemIcon>
                        <HomeIcon
                            color={
                                location.pathname === "/" ||
                                    location.pathname ===
                                    "/Teacher/dashboard"
                                    ? "primary"
                                    : "inherit"
                            }
                        />
                    </ListItemIcon>

                    <ListItemText primary="Home" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/Teacher/class"
                >
                    <ListItemIcon>
                        <ClassOutlinedIcon
                            color={
                                location.pathname.startsWith(
                                    "/Teacher/class"
                                )
                                    ? "primary"
                                    : "inherit"
                            }
                        />
                    </ListItemIcon>

                    <ListItemText
                        primary={`Class ${className}`}
                    />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/Teacher/meeting"
                >
                    <ListItemIcon>
                        <VideoCallOutlinedIcon
                            color={
                                location.pathname.startsWith(
                                    "/Teacher/meeting"
                                )
                                    ? "primary"
                                    : "inherit"
                            }
                        />
                    </ListItemIcon>

                    <ListItemText primary="Live Class" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/Teacher/complain"
                >
                    <ListItemIcon>
                        <AnnouncementOutlinedIcon
                            color={
                                location.pathname.startsWith(
                                    "/Teacher/complain"
                                )
                                    ? "primary"
                                    : "inherit"
                            }
                        />
                    </ListItemIcon>

                    <ListItemText primary="Complain" />
                </ListItemButton>
            </React.Fragment>

            <Divider sx={{ my: 1 }} />

            <React.Fragment>
                <ListSubheader
                    component="div"
                    inset
                >
                    User
                </ListSubheader>

                <ListItemButton
                    component={Link}
                    to="/Teacher/profile"
                >
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon
                            color={
                                location.pathname.startsWith(
                                    "/Teacher/profile"
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
            </React.Fragment>
        </>
    );
};

export default TeacherSideBar;