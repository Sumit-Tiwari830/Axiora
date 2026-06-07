import React, { useState } from "react";
import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Settings,
    Logout,
    AccountCircle,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const { currentRole, currentUser } = useSelector(
        (state) => state.user
    );

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const firstLetter =
        currentUser?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Tooltip title="Account">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#6366f1",
                                fontWeight: 700,
                            }}
                        >
                            {firstLetter}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        overflow: "visible",
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 3,

                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },

                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 18,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform:
                                "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography fontWeight={600}>
                        {currentUser?.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {currentRole}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem
                    component={Link}
                    to={`/${currentRole}/profile`}
                    onClick={handleClose}
                >
                    <ListItemIcon>
                        <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <Divider />

                <MenuItem
                    component={Link}
                    to="/logout"
                    onClick={handleClose}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;