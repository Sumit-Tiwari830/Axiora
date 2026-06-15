import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Button, IconButton,
    Avatar, Chip, CircularProgress
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Add as AddIcon,
    CurrencyRupee as RupeeIcon,
    Class as ClassIcon,
    CalendarToday as CalendarIcon,
    Receipt as ReceiptIcon,
} from '@mui/icons-material';
import axios from 'axios';
import TableTemplate from '../../../components/TableTemplate';
import { LightPurpleButton } from '../../../components/buttonStyles';

const ShowFees = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/FeesList/${currentUser._id}`)
            .then(res => {
                if (Array.isArray(res.data)) setFees(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [currentUser._id]);

    const feeColumns = [
        { id: 'details', label: 'Fee Description', minWidth: 180 },
        { id: 'amount', label: 'Amount', minWidth: 120 },
        { id: 'sclassName', label: 'Class', minWidth: 140 },
        { id: 'dueDate', label: 'Due Date', minWidth: 140 },
    ];

    const feeRows = fees.map((fee) => ({
        details: fee.feeDetails,
        amount: `₹${Number(fee.feeAmount).toLocaleString('en-IN')}`,
        sclassName: fee.sclassName?.sclassName || 'Unknown',
        dueDate: fee.dueDate
            ? new Date(fee.dueDate).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            })
            : 'N/A',
        id: fee._id,
    }));

    const FeeButtonHaver = ({ row }) => (
        <IconButton
            onClick={() => navigate(`/Admin/fees/fee/${row.id}`)}
            sx={{
                color: "#4f46e5",
                "&:hover": { background: "rgba(79,70,229,0.08)" },
            }}
        >
            <VisibilityIcon />
        </IconButton>
    );

    const totalRevenue = fees.reduce((sum, f) => sum + Number(f.feeAmount || 0), 0);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                        }}
                    >
                        <ReceiptIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="#0f172a">
                            Fees Management
                        </Typography>
                        <Typography color="#64748b" fontSize="0.9rem">
                            {fees.length} fee structure{fees.length !== 1 ? 's' : ''} created
                        </Typography>
                    </Box>
                </Box>

                <LightPurpleButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/Admin/addfee')}
                    sx={{ borderRadius: "12px", px: 3, py: 1.2 }}
                >
                    Add Fee
                </LightPurpleButton>
            </Box>

            {/* Summary Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2,
                    mb: 4,
                }}
            >
                {[
                    {
                        label: 'Total Structures',
                        value: fees.length,
                        icon: <ReceiptIcon />,
                        gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    },
                    {
                        label: 'Total Fee Value',
                        value: `₹${totalRevenue.toLocaleString('en-IN')}`,
                        icon: <RupeeIcon />,
                        gradient: "linear-gradient(135deg, #10b981, #059669)",
                    },
                    {
                        label: 'Classes Covered',
                        value: new Set(fees.map(f => f.sclassName?.sclassName)).size,
                        icon: <ClassIcon />,
                        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    },
                ].map((stat) => (
                    <Paper
                        key={stat.label}
                        sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 10px 30px rgba(79,70,229,0.10)",
                            },
                        }}
                    >
                        <Avatar sx={{ background: stat.gradient, width: 48, height: 48, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                            {stat.icon}
                        </Avatar>
                        <Box>
                            <Typography fontSize="0.78rem" color="#64748b" fontWeight={500}>
                                {stat.label}
                            </Typography>
                            <Typography fontWeight={800} fontSize="1.4rem" color="#0f172a">
                                {stat.value}
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: "#4f46e5" }} />
                </Box>
            ) : fees.length > 0 ? (
                <Paper
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: "20px",
                        boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography variant="h6" fontWeight={700} color="#0f172a">
                            All Fee Structures
                        </Typography>
                        <Chip
                            label={`${fees.length} records`}
                            size="small"
                            sx={{ background: "rgba(79,70,229,0.08)", color: "#4f46e5", fontWeight: 600 }}
                        />
                    </Box>
                    <TableTemplate
                        buttonHaver={FeeButtonHaver}
                        columns={feeColumns}
                        rows={feeRows}
                    />
                </Paper>
            ) : (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        borderRadius: "20px",
                        background: "rgba(79,70,229,0.02)",
                        border: "1px dashed rgba(79,70,229,0.2)",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            mx: "auto",
                            mb: 2,
                        }}
                    >
                        <ReceiptIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        No Fee Structures Yet
                    </Typography>
                    <Typography color="#64748b" mb={3}>
                        Create your first fee structure to get started.
                    </Typography>
                    <LightPurpleButton
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/Admin/addfee')}
                        sx={{ borderRadius: "12px", px: 4 }}
                    >
                        Add First Fee
                    </LightPurpleButton>
                </Paper>
            )}
        </Box>
    );
};

export default ShowFees;
