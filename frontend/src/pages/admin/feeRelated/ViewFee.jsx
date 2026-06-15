import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, CircularProgress,
    Avatar, Chip, Grid, Divider, Button
} from '@mui/material';
import {
    Receipt as ReceiptIcon,
    CheckCircle as PaidIcon,
    Cancel as UnpaidIcon,
    CurrencyRupee as RupeeIcon,
    CalendarToday as CalendarIcon,
    Class as ClassIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';
import TableTemplate from '../../../components/TableTemplate';

const ViewFee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fee, setFee] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeeAndStudents = async () => {
            try {
                const feeRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/Fee/${id}`);
                const feeData = feeRes.data;
                setFee(feeData);

                if (feeData?.sclassName) {
                    const sclassId = typeof feeData.sclassName === 'object'
                        ? feeData.sclassName._id
                        : feeData.sclassName;
                    const studentRes = await axios.get(
                        `${import.meta.env.VITE_REACT_APP_BASE_URL}/Sclass/Students/${sclassId}`
                    );
                    if (Array.isArray(studentRes.data)) {
                        setStudents(studentRes.data);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeeAndStudents();
    }, [id]);

    const studentColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll No.', minWidth: 100 },
        { id: 'status', label: 'Payment Status', minWidth: 150 },
    ];

    const studentRows = students.map(student => {
        const isPaid = student.feePayments?.some(
            p => p.feeId === id && p.status === 'Paid'
        );
        return {
            name: student.name,
            rollNum: student.rollNum,
            status: isPaid ? 'Paid' : 'Pending',
            id: student._id,
        };
    });

    const StatusButtonHaver = ({ row }) => {
        const isPaid = row.status === 'Paid';
        return (
            <Chip
                icon={isPaid ? <PaidIcon /> : <UnpaidIcon />}
                label={row.status}
                size="small"
                sx={{
                    fontWeight: 700,
                    background: isPaid ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    color: isPaid ? "#10b981" : "#ef4444",
                    border: `1px solid ${isPaid ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
            />
        );
    };

    const paidCount = students.filter(s =>
        s.feePayments?.some(p => p.feeId === id && p.status === 'Paid')
    ).length;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress sx={{ color: "#4f46e5" }} />
            </Box>
        );
    }

    if (!fee) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">Fee record not found.</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
            </Box>
        );
    }

    const dueDate = fee.dueDate ? new Date(fee.dueDate) : null;
    const totalRevenue = paidCount * Number(fee.feeAmount);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ color: "#64748b", textTransform: "none", fontWeight: 600, mb: 2, pl: 0, "&:hover": { background: "none", color: "#4f46e5" } }}
            >
                Back to Fees
            </Button>

            {/* Header */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar sx={{ width: 60, height: 60, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
                        <ReceiptIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)" }}>Fee Details</Typography>
                        <Typography variant="h4" fontWeight={800} color="#fff">
                            {fee.feeDetails}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                            View payment status of all students in this class.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Fee Info Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {[
                    { label: "Fee Amount", value: `₹${Number(fee.feeAmount).toLocaleString('en-IN')}`, icon: <RupeeIcon />, gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                    { label: "Due Date", value: dueDate ? dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A', icon: <CalendarIcon />, gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
                    { label: "Class", value: fee.sclassName?.sclassName || 'Unknown', icon: <ClassIcon />, gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
                    { label: "Revenue Collected", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: <PaidIcon />, gradient: "linear-gradient(135deg, #10b981, #059669)" },
                ].map((info) => (
                    <Grid item xs={12} sm={6} md={3} key={info.label}>
                        <Paper sx={{ p: 2.5, borderRadius: "16px", display: "flex", alignItems: "center", gap: 2, transition: "all 0.3s ease", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 30px rgba(79,70,229,0.10)" } }}>
                            <Avatar sx={{ background: info.gradient, width: 46, height: 46 }}>{info.icon}</Avatar>
                            <Box>
                                <Typography fontSize="0.75rem" color="#64748b" fontWeight={500}>{info.label}</Typography>
                                <Typography fontWeight={800} fontSize="1rem" color="#0f172a">{info.value}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Payment Progress */}
            <Paper sx={{ p: 3, borderRadius: "16px", mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography fontWeight={700} color="#0f172a">Payment Progress</Typography>
                    <Typography fontWeight={600} color="#4f46e5" fontSize="0.9rem">
                        {paidCount}/{students.length} students paid
                    </Typography>
                </Box>
                <Box sx={{ height: 10, background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                    <Box
                        sx={{
                            height: "100%",
                            width: students.length ? `${(paidCount / students.length) * 100}%` : "0%",
                            background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                            borderRadius: "10px",
                            transition: "width 0.8s ease",
                        }}
                    />
                </Box>
            </Paper>

            {/* Students Table */}
            {students.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: "20px", boxShadow: "0 4px 24px rgba(79,70,229,0.08)" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography variant="h6" fontWeight={700} color="#0f172a">
                            Student Payment Status
                        </Typography>
                        <Chip
                            label={`${students.length} students`}
                            size="small"
                            sx={{ background: "rgba(79,70,229,0.08)", color: "#4f46e5", fontWeight: 600 }}
                        />
                    </Box>
                    <TableTemplate
                        buttonHaver={StatusButtonHaver}
                        columns={studentColumns}
                        rows={studentRows}
                    />
                </Paper>
            ) : (
                <Typography color="#64748b" textAlign="center">No students found in this class.</Typography>
            )}
        </Box>
    );
};

export default ViewFee;
