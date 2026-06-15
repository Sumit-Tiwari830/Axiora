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
    ArrowBackOutlined as ArrowBackIcon
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

    const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || "U";
    const userName = currentUser?.name || "User";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(-45deg, #1e1b4b, #312e81, #4f46e5, #0f172a)",
                backgroundSize: "400% 400%",
                animation: "gradientAnimation 15s ease infinite",
                px: 2,
                "@keyframes gradientAnimation": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" }
                }
            }}
        >
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <Paper
                    elevation={24}
                    sx={{
                        width: "100%",
                        maxWidth: 440,
                        p: 5,
                        borderRadius: "28px",
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow: "0 24px 50px rgba(0, 0, 0, 0.3)",
                        color: "#fff"
                    }}
                >
                    <Fade in={true} timeout={800}>
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={900}
                                sx={{
                                    mb: 4,
                                    letterSpacing: "-0.03em",
                                    background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                AXIORA
                            </Typography>

                            <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        fontSize: "2.8rem",
                                        fontWeight: 800,
                                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                        boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
                                        border: "4px solid rgba(255, 255, 255, 0.2)",
                                        mx: "auto"
                                    }}
                                >
                                    {userInitial}
                                </Avatar>
                            </Box>

                            <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: "#f8fafc" }}>
                                {userName}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 4, px: 2 }}>
                                Are you sure you want to sign out from your account? You will need to log back in to access your dashboard.
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: "16px",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                                        boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                            boxShadow: "0 6px 24px rgba(239, 68, 68, 0.4)",
                                            transform: "translateY(-2px)"
                                        },
                                        transition: "all 0.2s"
                                    }}
                                >
                                    Yes, Logout
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        py: 1.8,
                                        borderRadius: "16px",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        textTransform: "none",
                                        color: "rgba(255, 255, 255, 0.8)",
                                        borderColor: "rgba(255, 255, 255, 0.2)",
                                        "&:hover": {
                                            borderColor: "rgba(255, 255, 255, 0.6)",
                                            background: "rgba(255, 255, 255, 0.05)",
                                            transform: "translateY(-2px)"
                                        },
                                        transition: "all 0.2s"
                                    }}
                                >
                                    Cancel & Return
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