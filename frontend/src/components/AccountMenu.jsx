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
                <Tooltip title="Account" arrow>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{
                            ml: 2,
                            p: 0.5,
                            borderRadius: "50%",
                            border: "2px solid transparent",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                border: "2px solid rgba(79, 70, 229, 0.3)",
                                background: "rgba(79, 70, 229, 0.06)",
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                background:
                                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                letterSpacing: "0.02em",
                                boxShadow:
                                    "0 2px 8px rgba(79, 70, 229, 0.3)",
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
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        mt: 1.5,
                        minWidth: 240,
                        borderRadius: "12px",
                        border: "1px solid rgba(148, 163, 184, 0.15)",
                        boxShadow:
                            "0 10px 40px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",

                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },

                        "& .MuiMenuItem-root": {
                            borderRadius: "8px",
                            mx: 1,
                            px: 1.5,
                            py: 1,
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#334155",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background:
                                    "rgba(79, 70, 229, 0.06)",
                                color: "#4f46e5",
                                "& .MuiListItemIcon-root": {
                                    color: "#4f46e5",
                                },
                            },
                        },

                        "& .MuiListItemIcon-root": {
                            color: "#64748b",
                            minWidth: 36,
                            transition: "color 0.2s ease",
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
                            borderLeft:
                                "1px solid rgba(148, 163, 184, 0.15)",
                            borderTop:
                                "1px solid rgba(148, 163, 184, 0.15)",
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
                <Box sx={{ px: 2.5, py: 1.5 }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "#0f172a",
                        }}
                    >
                        {currentUser?.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#94a3b8",
                            fontSize: "0.8125rem",
                            textTransform: "capitalize",
                            mt: 0.25,
                        }}
                    >
                        {currentRole}
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        mx: 1.5,
                        borderColor: "rgba(148, 163, 184, 0.12)",
                    }}
                />

                <Box sx={{ py: 0.5 }}>
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
                </Box>

                <Divider
                    sx={{
                        mx: 1.5,
                        borderColor: "rgba(148, 163, 184, 0.12)",
                    }}
                />

                <Box sx={{ py: 0.5 }}>
                    <MenuItem
                        component={Link}
                        to="/logout"
                        onClick={handleClose}
                        sx={{
                            "&:hover": {
                                background:
                                    "rgba(239, 68, 68, 0.06) !important",
                                color: "#ef4444 !important",
                                "& .MuiListItemIcon-root": {
                                    color: "#ef4444 !important",
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Box>
            </Menu>
        </>
    );
};

export default AccountMenu;