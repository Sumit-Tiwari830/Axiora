import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, CircularProgress, Stack, TextField,
    Typography, MenuItem, Paper, InputAdornment
} from "@mui/material";
import {
    CurrencyRupee as RupeeIcon,
    Class as ClassIcon,
    CalendarToday as CalendarIcon,
    Description as DescIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import axios from "axios";
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { LightPurpleButton } from '../../../components/buttonStyles';

const AddFee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { sclassesList } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    const [feeAmount, setFeeAmount] = useState("");
    const [feeDetails, setFeeDetails] = useState("");
    const [sclassName, setSclassName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [loader, setLoader] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);

        const fields = {
            feeAmount,
            feeDetails,
            sclassName,
            school: currentUser._id,
            dueDate,
        };

        axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/FeeCreate`, fields, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                setSuccess(true);
                setTimeout(() => navigate(-1), 1000);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoader(false));
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 620,
                    p: { xs: 3, md: 5 },
                    borderRadius: "24px",
                    background: "#fff",
                    boxShadow: "0 20px 60px rgba(79,70,229,0.10)",
                    border: "1px solid rgba(79,70,229,0.08)",
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#64748b",
                            textTransform: "none",
                            fontWeight: 600,
                            mb: 2,
                            pl: 0,
                            "&:hover": { background: "none", color: "#4f46e5" },
                        }}
                    >
                        Back
                    </Button>

                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            boxShadow: "0 6px 20px rgba(79,70,229,0.3)",
                        }}
                    >
                        <RupeeIcon sx={{ color: "#fff", fontSize: 28 }} />
                    </Box>

                    <Typography variant="h4" fontWeight={800} color="#0f172a" mb={0.5}>
                        Add Fee Notice
                    </Typography>
                    <Typography color="#64748b" fontSize="0.95rem">
                        Create a new fee structure for a class.
                    </Typography>
                </Box>

                {/* Form */}
                <form onSubmit={submitHandler}>
                    <Stack spacing={2.5}>
                        <TextField
                            fullWidth
                            label="Fee Description"
                            placeholder="e.g. Tuition Fee – Q2 2025"
                            value={feeDetails}
                            onChange={(e) => setFeeDetails(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescIcon sx={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Fee Amount (₹)"
                            type="number"
                            placeholder="e.g. 5000"
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <RupeeIcon sx={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            select
                            fullWidth
                            label="Target Class"
                            value={sclassName}
                            onChange={(e) => setSclassName(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ClassIcon sx={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select a class
                            </MenuItem>
                            {sclassesList &&
                                sclassesList.map((sclass) => (
                                    <MenuItem key={sclass._id} value={sclass._id}>
                                        {sclass.sclassName}
                                    </MenuItem>
                                ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon sx={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LightPurpleButton
                            type="submit"
                            fullWidth
                            size="large"
                            disabled={loader || success}
                            sx={{ mt: 1, py: 1.6, fontSize: "1rem", borderRadius: "14px" }}
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : success ? (
                                "✓ Created!"
                            ) : (
                                "Create Fee Notice"
                            )}
                        </LightPurpleButton>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default AddFee;
