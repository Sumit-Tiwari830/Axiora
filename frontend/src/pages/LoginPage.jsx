import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Grid,
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    TextField,
    IconButton,
    InputAdornment,
    CircularProgress,
    Backdrop,
    Button,
    Chip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const LoginPage = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, currentUser, response, currentRole } = useSelector(
        (state) => state.user
    );

    const [toggle, setToggle] = useState(false);
    const [guestLoader, setGuestLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role === "Student") {
            const rollNum = e.target.rollNumber.value.trim();
            const studentName = e.target.studentName.value.trim();
            const schoolName = e.target.schoolName.value.trim();
            const password = e.target.password.value;

            if (!rollNum || !studentName || !password || !schoolName) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!schoolName) setSchoolNameError(true);
                if (!password) setPasswordError(true);
                return;
            }

            setLoader(true);
            dispatch(loginUser({ rollNum, studentName, schoolName, password }, role));
        } else {
            const email = e.target.email.value;
            const password = e.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            setLoader(true);
            dispatch(loginUser({ email, password }, role));
        }
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        if (name === "email") setEmailError(false);
        if (name === "password") setPasswordError(false);
        if (name === "rollNumber") setRollNumberError(false);
        if (name === "studentName") setStudentNameError(false);
        if (name === "schoolName") setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === "success" || currentUser) {
            if (currentRole === "Admin") {
                navigate("/Admin/dashboard");
            } else if (currentRole === "Student") {
                navigate("/Student/dashboard");
            } else if (currentRole === "Teacher") {
                navigate("/Teacher/dashboard");
            }
        }

        if (status === "failed") {
            setLoader(false);
            setMessage(response);
            setShowPopup(true);
        }

        if (status === "error") {
            setLoader(false);
            setGuestLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentUser, currentRole, navigate, response]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* ── Left Branding Panel ─────────────────────── */}
            <Box
                sx={{
                    width: "40%",
                    background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #4f46e5 100%)",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    px: 5,
                }}
            >
                {/* Decorative blur circles */}
                <Box
                    sx={{
                        position: "absolute",
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(124, 58, 237, 0.3)",
                        filter: "blur(80px)",
                        top: -60,
                        right: -80,
                        pointerEvents: "none",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        background: "rgba(6, 182, 212, 0.2)",
                        filter: "blur(70px)",
                        bottom: -50,
                        left: -40,
                        pointerEvents: "none",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        background: "rgba(129, 140, 248, 0.15)",
                        filter: "blur(50px)",
                        top: "55%",
                        left: "30%",
                        pointerEvents: "none",
                    }}
                />

                {/* Branding content */}
                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <Typography
                        sx={{
                            fontSize: "2.8rem",
                            fontWeight: 800,
                            color: "#ffffff",
                            letterSpacing: "-0.02em",
                            mb: 2,
                        }}
                    >
                        AXIORA
                    </Typography>

                    <Box
                        sx={{
                            width: 48,
                            height: 3,
                            borderRadius: 2,
                            background: "linear-gradient(90deg, #818cf8, #06b6d4)",
                            mx: "auto",
                            mb: 3,
                        }}
                    />

                    <Typography
                        sx={{
                            color: "rgba(203, 213, 225, 0.85)",
                            fontSize: "1.1rem",
                            lineHeight: 1.7,
                            maxWidth: 300,
                        }}
                    >
                        The intelligent school management platform built for modern
                        education.
                    </Typography>
                </Box>
            </Box>

            {/* ── Right Form Panel ─────────────────────────── */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ffffff",
                    px: { xs: 3, sm: 5 },
                    py: 4,
                }}
            >
                <Box
                    className="animate-fadeInUp"
                    sx={{ width: "100%", maxWidth: 440 }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        {/* Mobile logo */}
                        <Typography
                            sx={{
                                display: { xs: "block", md: "none" },
                                fontSize: "1.6rem",
                                fontWeight: 800,
                                mb: 2,
                                background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            AXIORA
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                                }}
                            >
                                Welcome Back
                            </Typography>

                            <Chip
                                label={role}
                                size="small"
                                sx={{
                                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                    height: 26,
                                }}
                            />
                        </Box>

                        <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                            Sign in to your {role?.toLowerCase()} account to continue.
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        {role === "Student" ? (
                            <>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Roll Number"
                                    name="rollNumber"
                                    error={rollNumberError}
                                    helperText={rollNumberError && "Roll Number is required"}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Student Name"
                                    name="studentName"
                                    error={studentNameError}
                                    helperText={studentNameError && "Name is required"}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="School Name"
                                    name="schoolName"
                                    error={schoolNameError}
                                    helperText={schoolNameError && "School Name is required"}
                                    onChange={handleInputChange}
                                />
                            </>
                        ) : (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email Address"
                                name="email"
                                error={emailError}
                                helperText={emailError && "Email is required"}
                                onChange={handleInputChange}
                            />
                        )}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            name="password"
                            type={toggle ? "text" : "password"}
                            error={passwordError}
                            helperText={passwordError && "Password is required"}
                            onChange={handleInputChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setToggle(!toggle)}>
                                            {toggle ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 1,
                            }}
                        >
                            <FormControlLabel
                                control={<Checkbox />}
                                label="Remember me"
                            />

                            <Typography
                                component={Link}
                                to="#"
                                sx={{
                                    textDecoration: "none",
                                    color: "#4f46e5",
                                    fontWeight: 600,
                                    fontSize: "0.85rem",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                textTransform: "none",
                                boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #3730a3, #5b21b6)",
                                    boxShadow: "0 6px 24px rgba(79, 70, 229, 0.4)",
                                },
                            }}
                        >
                            {loader ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: "12px",
                                borderColor: "#e2e8f0",
                                borderWidth: "1.5px",
                                color: "#475569",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#c7d2fe",
                                    background: "rgba(79, 70, 229, 0.04)",
                                    borderWidth: "1.5px",
                                },
                            }}
                        >
                            Continue as Guest
                        </Button>

                        {role === "Admin" && (
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    mt: 4,
                                    color: "#64748b",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Don't have an account?{" "}
                                <Box
                                    component={Link}
                                    to="/Adminregister"
                                    sx={{
                                        textDecoration: "none",
                                        color: "#4f46e5",
                                        fontWeight: 700,
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    Create School
                                </Box>
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Loading / Popup overlays */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={guestLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </Box>
    );
};

export default LoginPage;