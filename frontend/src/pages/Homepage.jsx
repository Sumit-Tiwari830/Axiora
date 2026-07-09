import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import {
    Videocam,
    BarChart,
    AccountBalanceWallet,
    Psychology,
} from "@mui/icons-material";
import Students from "../assets/student.png";
import Footer from "../components/Footer";

const features = [
    {
        icon: <Videocam sx={{ fontSize: 30, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        title: "Real-time Classes",
        desc: "Host and join live classes with seamless video integration and interactive tools.",
    },
    {
        icon: <BarChart sx={{ fontSize: 30, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        title: "Smart Analytics",
        desc: "Track performance trends, attendance patterns, and academic insights at a glance.",
    },
    {
        icon: <AccountBalanceWallet sx={{ fontSize: 30, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
        title: "Fee Management",
        desc: "Automate fee collection, receipts, and payment tracking with full transparency.",
    },
    {
        icon: <Psychology sx={{ fontSize: 30, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
        title: "AI Doubt Solver",
        desc: "Instant AI-powered doubt resolution for students — anytime, anywhere.",
    },
];

const Homepage = () => {
    return (
        <Box sx={{ minHeight: "100vh", overflow: "hidden" }}>
            {/* ── Hero Section ─────────────────────────────────── */}
            <Box
                className="animate-fadeInUp"
                sx={{
                    position: "relative",
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 70%, #4f46e5 100%)",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* Floating decorative blur circles */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "rgba(124, 58, 237, 0.25)",
                        filter: "blur(100px)",
                        top: -80,
                        right: -60,
                        pointerEvents: "none",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(6, 182, 212, 0.2)",
                        filter: "blur(80px)",
                        bottom: -50,
                        left: -40,
                        pointerEvents: "none",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        background: "rgba(129, 140, 248, 0.18)",
                        filter: "blur(60px)",
                        top: "50%",
                        left: "40%",
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: 6 }}>
                    <Grid container spacing={6} alignItems="center">
                        {/* Left — Text Content */}
                        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                            <Box className="animate-fadeInUp">
                                <Typography
                                    sx={{
                                        color: "rgba(167, 139, 250, 0.9)",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        letterSpacing: 3,
                                        textTransform: "uppercase",
                                        mb: 2,
                                    }}
                                >
                                    School Management Platform
                                </Typography>

                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        color: "#ffffff",
                                        mb: 3,
                                    }}
                                >
                                    Empowering Education
                                    <br />
                                    with{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            background: "linear-gradient(90deg, #818cf8, #06b6d4)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Axiora
                                    </Box>
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: { xs: "1rem", md: "1.15rem" },
                                        color: "rgba(203, 213, 225, 0.85)",
                                        lineHeight: 1.8,
                                        maxWidth: 520,
                                        mb: 5,
                                    }}
                                >
                                    Manage students, teachers, classes, attendance, notices, and
                                    academic performance from one intelligent platform. Built for
                                    modern schools that value efficiency, transparency, and growth.
                                </Typography>

                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
                                    <Button
                                        component={Link}
                                        to="/choose"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            background: "#ffffff",
                                            color: "#312e81",
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.6,
                                            borderRadius: "12px",
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                            "&:hover": {
                                                background: "#f1f5f9",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                                            },
                                        }}
                                    >
                                        Get Started
                                    </Button>

                                    <Button
                                        component={Link}
                                        to="/chooseasguest"
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor: "rgba(255,255,255,0.4)",
                                            color: "#ffffff",
                                            fontWeight: 600,
                                            px: 4,
                                            py: 1.6,
                                            borderRadius: "12px",
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            backdropFilter: "blur(8px)",
                                            "&:hover": {
                                                borderColor: "#ffffff",
                                                background: "rgba(255,255,255,0.08)",
                                                transform: "translateY(-2px)",
                                            },
                                        }}
                                    >
                                        Explore as Guest
                                    </Button>
                                </Box>

                                <Typography sx={{ color: "rgba(148, 163, 184, 0.8)", fontSize: "0.9rem" }}>
                                    Don't have an account?{" "}
                                    <Box
                                        component={Link}
                                        to="/Adminregister"
                                        sx={{
                                            color: "#818cf8",
                                            fontWeight: 700,
                                            textDecoration: "none",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        Create Your Own School →
                                    </Box>
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Right — Student Image */}
                        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                            <Box
                                className="animate-fadeIn delay-300"
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
                                {/* Glow behind image */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        width: "80%",
                                        height: "80%",
                                        borderRadius: "50%",
                                        background: "rgba(79, 70, 229, 0.2)",
                                        filter: "blur(60px)",
                                        top: "10%",
                                        left: "10%",
                                        pointerEvents: "none",
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={Students}
                                    alt="students"
                                    sx={{
                                        width: { xs: "85%", md: "110%" },
                                        maxWidth: 700,
                                        position: "relative",
                                        zIndex: 1,
                                        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── Features Section ─────────────────────────────── */}
            <Box
                className="animate-fadeInUp delay-200"
                sx={{
                    py: { xs: 8, md: 10 },
                    px: 2,
                    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: "center",
                            fontWeight: 800,
                            fontSize: { xs: "1.8rem", md: "2.4rem" },
                            mb: 1.5,
                            color: "#0f172a",
                        }}
                    >
                        Everything You Need,{" "}
                        <Box
                            component="span"
                            className="gradient-text"
                        >
                            All in One Place
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: "1.05rem",
                            mb: 7,
                            maxWidth: 560,
                            mx: "auto",
                        }}
                    >
                        Axiora brings together powerful tools to streamline every aspect
                        of school management.
                    </Typography>

                    <Grid container spacing={3} justifyContent="center">
                        {features.map((f, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Box
                                    className={`animate-fadeInUp delay-${(i + 1) * 100}`}
                                    sx={{
                                        p: 3.5,
                                        borderRadius: "16px",
                                        background: "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        textAlign: "center",
                                        cursor: "default",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-8px)",
                                            boxShadow: "0 12px 40px rgba(79,70,229,0.12)",
                                            borderColor: "#c7d2fe",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "16px",
                                            background: f.gradient,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 2.5,
                                            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                                        }}
                                    >
                                        {f.icon}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1.05rem",
                                            color: "#0f172a",
                                            mb: 1,
                                        }}
                                    >
                                        {f.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#64748b",
                                            fontSize: "0.88rem",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {f.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── Footer CTA ──────────────────────────────────── */}
            <Box
                sx={{
                    py: 6,
                    textAlign: "center",
                    background: "#f8fafc",
                    borderTop: "1px solid #e2e8f0",
                }}
            >
                <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    Ready to transform your school?{" "}
                    <Box
                        component={Link}
                        to="/Adminregister"
                        sx={{
                            color: "#4f46e5",
                            fontWeight: 700,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Create Your Own School
                    </Box>
                </Typography>
            </Box>
            <Footer />
        </Box>
    );
};

export default Homepage;