import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../redux/userRelated/userSlice";
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Zoom,
    Fade
} from "@mui/material";
import {
    LogoutOutlined as LogoutIcon,
    CancelOutlined as CancelIcon
} from "@mui/icons-material";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector(
        (state) => state.user.currentUser
    );

    const handleLogout = () => {
        dispatch(authLogout());
        navigate("/");
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const userName = currentUser?.name || "User";

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.55)", // Soft dark overlay
                backdropFilter: "blur(12px)", // Blurs the dashboard behind
                WebkitBackdropFilter: "blur(12px)",
                zIndex: 3000, // Sits above sidebar and appbar
                px: 2
            }}
        >
            <Zoom in={true} style={{ transitionDelay: "50ms" }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        p: 4,
                        borderRadius: "24px",
                        textAlign: "center",
                        background: "#ffffff",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        color: "#0f172a"
                    }}
                >
                    <Fade in={true} timeout={600}>
                        <Box>
                            {/* Glowing Exit Icon */}
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: "rgba(239, 68, 68, 0.09)",
                                    color: "#ef4444",
                                    border: "1px solid rgba(239, 68, 68, 0.15)",
                                    mx: "auto",
                                    mb: 3
                                }}
                            >
                                <LogoutIcon sx={{ fontSize: 30 }} />
                            </Avatar>

                            <Typography
                                variant="h5"
                                fontWeight={800}
                                sx={{
                                    mb: 1,
                                    letterSpacing: "-0.02em",
                                    color: "#0f172a"
                                }}
                            >
                                Log out of Axiora
                            </Typography>

                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: "#64748b", 
                                    mb: 4, 
                                    px: 1, 
                                    lineHeight: 1.6 
                                }}
                            >
                                Are you sure you want to log out, <strong>{userName}</strong>? You will need to re-authenticate to access your portals.
                            </Typography>

                            {/* Side-by-side Button Layout */}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleCancel}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: "12px",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        color: "#475569",
                                        borderColor: "#cbd5e1",
                                        "&:hover": {
                                            borderColor: "#94a3b8",
                                            background: "#f8fafc"
                                        },
                                        transition: "all 0.15s"
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleLogout}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        background: "#ef4444",
                                        boxShadow: "0 2px 4px rgba(239, 68, 68, 0.15)",
                                        "&:hover": {
                                            background: "#dc2626",
                                            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)"
                                        },
                                        transition: "all 0.15s"
                                    }}
                                >
                                    Log Out
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Paper>
            </Zoom>
        </Box>
    );
};

export default Logout;