import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
    Grid,
    Box,
    Typography,
    Paper,
    TextField,
    CssBaseline,
    IconButton,
    InputAdornment,
    CircularProgress,
    Card,
    CardContent,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import bgpic from "../../assets/login-bg.png";
import { LightPurpleButton } from "../../components/buttonStyles";
import { registerUser } from "../../redux/userRelated/userHandle";
import Popup from "../../components/Popup";

const theme = createTheme();

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(
        (state) => state.user
    );

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);

    const [name, setName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const role = "Admin";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !schoolName || !email || !password) {
            setAdminNameError(!name);
            setSchoolNameError(!schoolName);
            setEmailError(!email);
            setPasswordError(!password);
            return;
        }

        const fields = {
            name,
            schoolName,
            email,
            password,
            role,
        };

        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (
            status === "success" ||
            (currentUser !== null && currentRole === "Admin")
        ) {
            navigate("/Admin/dashboard");
        } else if (status === "failed") {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === "error") {
            console.log(error);
            setLoader(false);
        }
    }, [status, currentUser, currentRole, navigate, response, error]);

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ minHeight: "100vh" }}>
                <CssBaseline />

                <Grid
                    item
                    xs={12}
                    md={5}
                    component={Paper}
                    square
                    elevation={0}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f8fafc",
                    }}
                >
                    <Card
                        sx={{
                            width: "90%",
                            maxWidth: 500,
                            borderRadius: "24px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography
                                variant="h4"
                                fontWeight="700"
                                textAlign="center"
                                sx={{
                                    background:
                                        "linear-gradient(135deg,#4f46e5,#7c3aed)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 1,
                                }}
                            >
                                Admin Registration
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ mb: 4 }}
                            >
                                Create and manage your school portal.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="adminName"
                                    label="Admin Name"
                                    value={name}
                                    error={adminNameError}
                                    helperText={adminNameError && "Name is required"}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setAdminNameError(false);
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="schoolName"
                                    label="School Name"
                                    value={schoolName}
                                    error={schoolNameError}
                                    helperText={schoolNameError && "School Name is required"}
                                    onChange={(e) => {
                                        setSchoolName(e.target.value);
                                        setSchoolNameError(false);
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="email"
                                    label="Email Address"
                                    value={email}
                                    error={emailError}
                                    helperText={emailError && "Email is required"}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError(false);
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="password"
                                    label="Password"
                                    type={toggle ? "text" : "password"}
                                    value={password}
                                    error={passwordError}
                                    helperText={passwordError && "Password is required"}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError(false);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setToggle(!toggle)}
                                                >
                                                    {toggle ? (
                                                        <Visibility />
                                                    ) : (
                                                        <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <LightPurpleButton
                                    type="submit"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        fontSize: "16px",
                                    }}
                                >
                                    {loader ? (
                                        <CircularProgress
                                            size={24}
                                            color="inherit"
                                        />
                                    ) : (
                                        "Register"
                                    )}
                                </LightPurpleButton>

                                <Typography
                                    textAlign="center"
                                    sx={{ mt: 3 }}
                                >
                                    Already have an account?{" "}
                                    <Link
                                        to="/Adminlogin"
                                        style={{
                                            textDecoration: "none",
                                            color: "#7c3aed",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={false}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </Grid>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </ThemeProvider>
    );
};

export default AdminRegisterPage;