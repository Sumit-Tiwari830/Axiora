import React, { useEffect, useState } from 'react';
import {
    Box, Button, Paper, Typography, Grid, Avatar,
    Chip, CircularProgress, Divider, LinearProgress
} from '@mui/material';
import {
    CurrencyRupee as RupeeIcon,
    CheckCircle as PaidIcon,
    Schedule as PendingIcon,
    Receipt as ReceiptIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StudentFee = () => {
    const { currentUser } = useSelector(state => state.user);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const schoolId = typeof currentUser.school === 'object'
                    ? currentUser.school._id
                    : currentUser.school;
                const classId = typeof currentUser.sclassName === 'object'
                    ? currentUser.sclassName._id
                    : currentUser.sclassName;

                const res = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_BASE_URL}/FeesList/${schoolId}`
                );
                if (Array.isArray(res.data)) {
                    const classFees = res.data.filter(
                        f => f.sclassName?._id === classId || f.sclassName === classId
                    );
                    setFees(classFees);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, [currentUser]);

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handlePayment = async (fee) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        try {
            const schoolId = typeof currentUser.school === 'object'
                ? currentUser.school._id
                : currentUser.school;

            const orderRes = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/razorpay/order`,
                { amount: fee.feeAmount, currency: "INR", schoolId }
            );
            const { id: order_id, amount, currency } = orderRes.data;

            const options = {
                key: "dummy_key",
                amount: amount.toString(),
                currency,
                name: "Axiora School",
                description: fee.feeDetails,
                order_id,
                handler: async (response) => {
                    const data = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        studentId: currentUser._id,
                        feeId: fee._id,
                        amountPaid: fee.feeAmount,
                    };
                    const verifyRes = await axios.post(
                        `${import.meta.env.VITE_REACT_APP_BASE_URL}/razorpay/verify`,
                        data
                    );
                    if (verifyRes.data.message === "Payment successful") {
                        alert("✅ Payment successful!");
                        window.location.reload();
                    }
                },
                prefill: {
                    name: currentUser.name,
                    email: "student@axiora.edu",
                    contact: "9999999999",
                },
                theme: { color: "#4f46e5" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    };

    const isFeePaid = (feeId) =>
        currentUser.feePayments?.some(
            p => p.feeId === feeId && p.status === 'Paid'
        );

    const paidCount = fees.filter(f => isFeePaid(f._id)).length;
    const pendingCount = fees.length - paidCount;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress sx={{ color: "#4f46e5" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Header Banner */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", display: "block" }}>
                        Student Portal
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="#fff" mb={0.5}>
                        Fee Dashboard 💳
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.92rem" }}>
                        View and pay your class fees securely via Razorpay.
                    </Typography>
                </Box>
            </Paper>

            {/* Summary */}
            {fees.length > 0 && (
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {[
                        { label: "Total Fees", value: fees.length, icon: <ReceiptIcon />, gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                        { label: "Paid", value: paidCount, icon: <PaidIcon />, gradient: "linear-gradient(135deg, #10b981, #059669)" },
                        { label: "Pending", value: pendingCount, icon: <PendingIcon />, gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
                    ].map((stat) => (
                        <Grid item xs={12} sm={4} key={stat.label}>
                            <Paper
                                sx={{
                                    p: 2.5,
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 30px rgba(79,70,229,0.10)" },
                                }}
                            >
                                <Avatar sx={{ background: stat.gradient, width: 48, height: 48 }}>
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography fontSize="0.78rem" color="#64748b" fontWeight={500}>{stat.label}</Typography>
                                    <Typography fontWeight={800} fontSize="1.6rem" color="#0f172a">{stat.value}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Fee Cards */}
            {fees.length === 0 ? (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: "center",
                        borderRadius: "20px",
                        background: "rgba(79,70,229,0.02)",
                        border: "1px dashed rgba(79,70,229,0.2)",
                    }}
                >
                    <Avatar sx={{ width: 72, height: 72, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", mx: "auto", mb: 2 }}>
                        <RupeeIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        No Fees Assigned
                    </Typography>
                    <Typography color="#64748b">
                        Your class has no fee structures assigned yet.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {fees.map(fee => {
                        const paid = isFeePaid(fee._id);
                        const dueDate = fee.dueDate ? new Date(fee.dueDate) : null;
                        const isOverdue = dueDate && !paid && dueDate < new Date();
                        return (
                            <Grid item xs={12} md={6} key={fee._id}>
                                <Paper
                                    sx={{
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 16px 40px rgba(79,70,229,0.12)",
                                        },
                                        border: paid ? "1px solid rgba(16,185,129,0.2)" : isOverdue ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(79,70,229,0.08)",
                                    }}
                                >
                                    {/* Card top accent */}
                                    <Box
                                        sx={{
                                            height: 6,
                                            background: paid
                                                ? "linear-gradient(90deg, #10b981, #059669)"
                                                : isOverdue
                                                    ? "linear-gradient(90deg, #ef4444, #dc2626)"
                                                    : "linear-gradient(90deg, #4f46e5, #7c3aed)",
                                        }}
                                    />

                                    <Box sx={{ p: 3 }}>
                                        {/* Fee Header */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        background: paid
                                                            ? "linear-gradient(135deg, #10b981, #059669)"
                                                            : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                                    }}
                                                >
                                                    {paid ? <PaidIcon /> : <ReceiptIcon />}
                                                </Avatar>
                                                <Box>
                                                    <Typography fontWeight={700} color="#0f172a" fontSize="1rem">
                                                        {fee.feeDetails}
                                                    </Typography>
                                                    <Typography variant="caption" color="#64748b">
                                                        Fee Notice
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                label={paid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    background: paid
                                                        ? "rgba(16,185,129,0.1)"
                                                        : isOverdue
                                                            ? "rgba(239,68,68,0.1)"
                                                            : "rgba(245,158,11,0.1)",
                                                    color: paid ? "#10b981" : isOverdue ? "#ef4444" : "#f59e0b",
                                                }}
                                            />
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        {/* Fee Info */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <RupeeIcon sx={{ color: "#4f46e5", fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="caption" color="#64748b">Amount</Typography>
                                                    <Typography fontWeight={800} fontSize="1.3rem" color="#0f172a">
                                                        ₹{Number(fee.feeAmount).toLocaleString('en-IN')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <CalendarIcon sx={{ color: isOverdue ? "#ef4444" : "#64748b", fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="caption" color="#64748b">Due Date</Typography>
                                                    <Typography fontWeight={600} color={isOverdue ? "#ef4444" : "#0f172a"} fontSize="0.9rem">
                                                        {dueDate ? dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Action */}
                                        {paid ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    p: 1.5,
                                                    borderRadius: "12px",
                                                    background: "rgba(16,185,129,0.07)",
                                                    border: "1px solid rgba(16,185,129,0.2)",
                                                }}
                                            >
                                                <PaidIcon sx={{ color: "#10b981", fontSize: 20 }} />
                                                <Typography fontWeight={700} color="#10b981" fontSize="0.9rem">
                                                    Payment Complete
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                onClick={() => handlePayment(fee)}
                                                sx={{
                                                    borderRadius: "12px",
                                                    py: 1.3,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                                    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                                                    "&:hover": {
                                                        background: "linear-gradient(135deg, #3730a3, #5b21b6)",
                                                    },
                                                }}
                                            >
                                                💳 Pay Now — ₹{Number(fee.feeAmount).toLocaleString('en-IN')}
                                            </Button>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default StudentFee;
