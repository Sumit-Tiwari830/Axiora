import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Grid,
    Box,
    Typography,
    Paper,
    Checkbox,
    FormControlLabel,
    TextField,
    CssBaseline,
    IconButton,
    InputAdornment,
    CircularProgress,
    Backdrop,
    Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import styled from "styled-components";
import bgpic from "../assets/login-bg.png";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const theme = createTheme();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role === "Student") {
            const rollNum = e.target.rollNumber.value;
            const studentName = e.target.studentName.value;
            const password = e.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }

            setLoader(true);
            dispatch(loginUser({ rollNum, studentName, password }, role));
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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container component="main" sx={{ height: "100vh" }}>
                <Grid
                    item
                    xs={12}
                    md={5}
                    component={Paper}
                    elevation={0}
                    square
                    sx={{
                        background: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 5,
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: 420 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            AXIORA
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                color: "#0f172a",
                            }}
                        >
                            {role} Login
                        </Typography>

                        <Typography
                            sx={{
                                color: "#64748b",
                                mb: 4,
                            }}
                        >
                            Welcome back. Sign in to continue.
                        </Typography>

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
                                <FormControlLabel control={<Checkbox />} label="Remember me" />

                                <StyledLink to="#">Forgot Password?</StyledLink>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: "12px",
                                    background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                                }}
                            >
                                {loader ? (
                                    <CircularProgress size={22} color="inherit" />
                                ) : (
                                    "Login"
                                )}
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: "12px",
                                    borderColor: "#7c3aed",
                                    color: "#7c3aed",
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
                                    }}
                                >
                                    Don't have an account?{" "}
                                    <StyledLink to="/Adminregister">Create School</StyledLink>
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

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
            </Grid>
        </ThemeProvider>
    );
};

export default LoginPage;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #7c3aed;
  font-weight: 600;
`;