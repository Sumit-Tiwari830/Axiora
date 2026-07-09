import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import {
    AdminPanelSettings,
    School,
    Person,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";
import Footer from "../components/Footer";

const roles = [
    {
        key: "Admin",
        label: "Administrator",
        icon: <AdminPanelSettings sx={{ fontSize: 44, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        shadow: "rgba(79, 70, 229, 0.35)",
        desc: "Manage students, teachers, classes, attendance, notices and complete school operations.",
    },
    {
        key: "Student",
        label: "Student",
        icon: <School sx={{ fontSize: 44, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        shadow: "rgba(6, 182, 212, 0.35)",
        desc: "View attendance, notices, academic records, results and school updates.",
    },
    {
        key: "Teacher",
        label: "Teacher",
        icon: <Person sx={{ fontSize: 44, color: "#fff" }} />,
        gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
        shadow: "rgba(16, 185, 129, 0.35)",
        desc: "Manage classes, subjects, assignments, attendance and student performance.",
    },
];

const ChooseUser = ({ visitor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const password = "zxc";

    const { status, currentUser, currentRole } = useSelector(
        (state) => state.user
    );

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const navigateHandler = (user) => {
        if (user === "Admin") {
            navigate("/Adminlogin");
        } else if (user === "Student") {
            navigate("/Studentlogin");
        } else if (user === "Teacher") {
            navigate("/Teacherlogin");
        }
    };

    useEffect(() => {
        if (status === "success" || currentUser !== null) {
            if (currentRole === "Admin") {
                navigate("/Admin/dashboard");
            } else if (currentRole === "Student") {
                navigate("/Student/dashboard");
            } else if (currentRole === "Teacher") {
                navigate("/Teacher/dashboard");
            }
        }

        if (status === "error") {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentRole, navigate, currentUser]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                background: "linear-gradient(160deg, #f0f2f8 0%, #e8e6f8 50%, #eef2ff 100%)",
                position: "relative",
                overflow: "hidden",
                pt: 8,
                pb: 2,
                px: 2,
            }}
        >
            {/* Decorative bg blur */}
            <Box
                sx={{
                    position: "absolute",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "rgba(79, 70, 229, 0.08)",
                    filter: "blur(80px)",
                    top: -100,
                    right: -50,
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    background: "rgba(124, 58, 237, 0.06)",
                    filter: "blur(70px)",
                    bottom: -80,
                    left: -40,
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, my: "auto" }}>
                {/* Header */}
                <Box className="animate-fadeInUp" sx={{ textAlign: "center", mb: 7 }}>
                    {visitor === "guest" && (
                        <Box
                            sx={{
                                display: "inline-block",
                                px: 2.5,
                                py: 0.6,
                                borderRadius: "20px",
                                background: "rgba(79, 70, 229, 0.08)",
                                border: "1px solid rgba(79, 70, 229, 0.15)",
                                mb: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    color: "#4f46e5",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                👋 Guest Mode
                            </Typography>
                        </Box>
                    )}

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2rem", md: "3rem" },
                            fontWeight: 800,
                            mb: 1.5,
                            color: "#0f172a",
                        }}
                    >
                        Choose Your{" "}
                        <Box component="span" className="gradient-text">
                            Role
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            color: "#64748b",
                            fontSize: "1.1rem",
                        }}
                    >
                        Select how you want to sign in to Axiora
                    </Typography>
                </Box>

                {/* Role Cards */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        gap: { xs: 2.5, md: 3.5 },
                        flexWrap: "wrap",
                    }}
                >
                    {roles.map((role, i) => (
                        <Box
                            key={role.key}
                            className={`animate-fadeInUp delay-${(i + 1) * 100}`}
                            onClick={() => navigateHandler(role.key)}
                            sx={{
                                width: { xs: "100%", sm: 320 },
                                maxWidth: 340,
                                p: 4,
                                borderRadius: "16px",
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    transform: "translateY(-10px)",
                                    boxShadow: `0 20px 50px ${role.shadow}`,
                                    borderColor: "#c7d2fe",
                                },
                            }}
                        >
                            {/* Icon circle */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: role.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mx: "auto",
                                    mb: 2.5,
                                    boxShadow: `0 6px 20px ${role.shadow}`,
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                {role.icon}
                            </Box>

                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    color: "#0f172a",
                                    mb: 1.5,
                                }}
                            >
                                {role.label}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748b",
                                    fontSize: "0.9rem",
                                    lineHeight: 1.7,
                                }}
                            >
                                {role.desc}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={loader}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Popup
                    message={message}
                    setShowPopup={setShowPopup}
                    showPopup={showPopup}
                />
            </Container>
            <Footer />
        </Box>
    );
};

export default ChooseUser;