import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon } from "@mui/icons-material";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "20%",
                    left: "10%",
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(79, 70, 229, 0.15), transparent 70%)",
                    filter: "blur(60px)",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "10%",
                    right: "15%",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)",
                    filter: "blur(60px)",
                },
            }}
        >
            <Box
                className="animate-fadeInUp"
                sx={{
                    maxWidth: 520,
                    width: "90%",
                    textAlign: "center",
                    p: { xs: 4, sm: 6 },
                    background: "rgba(255, 255, 255, 0.06)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow:
                        "0 24px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Typography
                    className="animate-float"
                    sx={{
                        fontSize: { xs: "5rem", sm: "7rem" },
                        fontWeight: 900,
                        lineHeight: 1,
                        mb: 1,
                        background:
                            "linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        letterSpacing: "-0.04em",
                        textShadow: "none",
                    }}
                >
                    404
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.92)",
                        mb: 1.5,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Page Not Found
                </Typography>

                <Typography
                    sx={{
                        fontSize: "0.9375rem",
                        color: "rgba(255, 255, 255, 0.5)",
                        lineHeight: 1.7,
                        mb: 4,
                        maxWidth: 360,
                        mx: "auto",
                    }}
                >
                    The page you are looking for doesn't exist
                    or has been moved to another location.
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                        background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        color: "#ffffff",
                        borderRadius: "12px",
                        px: 4,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        boxShadow:
                            "0 8px 24px rgba(79, 70, 229, 0.35)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            background:
                                "linear-gradient(135deg, #3730a3, #5b21b6)",
                            boxShadow:
                                "0 12px 32px rgba(79, 70, 229, 0.5)",
                            transform: "translateY(-2px)",
                        },
                        "&:active": {
                            transform: "translateY(0)",
                        },
                    }}
                >
                    Back To Home
                </Button>
            </Box>
        </Box>
    );
};

export default ErrorPage;