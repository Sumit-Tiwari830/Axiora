import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Avatar,
    Box,
    Grid,
    Divider,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authSuccess } from "../../../redux/userRelated/userSlice";

const StudentProfile = () => {
    const {
        currentUser,
        response,
        error,
    } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    const [emailInput, setEmailInput] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

    const handleAddEmail = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${baseUrl}/StudentAddEmail`, {
                studentId: currentUser._id,
                email: emailInput
            });
            setMessage(res.data.message);
            setShowOtpDialog(true);
        } catch (err) {
            console.error(err);
            setMessage("Failed to send OTP");
        }
        setLoading(false);
    };

    const handleVerifyEmail = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${baseUrl}/StudentVerifyEmail`, {
                studentId: currentUser._id,
                otp: otpInput
            });
            setMessage(res.data.message);
            setShowOtpDialog(false);
            
            // Update the user in Redux and localStorage
            const updatedUser = { ...currentUser, ...res.data.student };
            dispatch(authSuccess(updatedUser));
            
        } catch (err) {
            console.error(err);
            setMessage("Invalid OTP or Expired");
        }
        setLoading(false);
    };

    if (response) console.log(response);
    if (error) console.log(error);

    return (
        <Container maxWidth="md">
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: "24px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: "3rem",
                            mb: 2,
                            bgcolor: "#2563eb",
                        }}
                    >
                        {currentUser?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {currentUser?.name}
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Student Profile
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Roll Number
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.rollNum ||
                                "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Class
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.sclassName
                                ?.sclassName ||
                                "Not Assigned"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            School
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.school
                                ?.schoolName ||
                                "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Role
                        </Typography>

                        <Typography variant="h6">
                            Student
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Email
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6">
                                {currentUser?.email || "Not Provided"}
                            </Typography>
                            {currentUser?.email && (
                                <Chip 
                                    label={currentUser?.emailVerified ? "Verified" : "Unverified"} 
                                    color={currentUser?.emailVerified ? "success" : "warning"} 
                                    size="small" 
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {!currentUser?.emailVerified && (
                    <Box mt={4} p={3} border="1px dashed #ccc" borderRadius="8px">
                        <Typography variant="h6" mb={2}>Verify Your Email</Typography>
                        <Typography color="text.secondary" mb={2}>
                            Add and verify your email to receive school notices.
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center">
                            <TextField 
                                size="small" 
                                label="Email Address" 
                                value={emailInput} 
                                onChange={(e) => setEmailInput(e.target.value)} 
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleAddEmail}
                                disabled={loading || !emailInput}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                            </Button>
                        </Box>
                        {message && <Typography color={message.includes("Failed") || message.includes("Invalid") ? "error" : "primary"} mt={1}>{message}</Typography>}
                    </Box>
                )}

                <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)}>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogContent>
                        <Typography mb={2}>An OTP has been sent to {emailInput}</Typography>
                        <TextField 
                            autoFocus 
                            fullWidth 
                            label="OTP" 
                            value={otpInput} 
                            onChange={(e) => setOtpInput(e.target.value)} 
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowOtpDialog(false)}>Cancel</Button>
                        <Button onClick={handleVerifyEmail} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default StudentProfile;