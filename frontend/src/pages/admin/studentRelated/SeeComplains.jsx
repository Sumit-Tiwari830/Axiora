import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper, Box, IconButton, Typography, Avatar, Chip, CircularProgress
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ReportProblem as ComplainIcon,
    Person as PersonIcon,
    CheckCircle as ResolvedIcon,
} from '@mui/icons-material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import ConfirmModal from '../../../components/ConfirmModal';

const SeeComplains = () => {
    const dispatch = useDispatch();

    const { complainsList, loading, error, response } =
        useSelector((state) => state.complain);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllComplains(currentUser._id, "Complain"));
    }, [currentUser._id, dispatch]);

    if (error) console.log(error);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ id: null, address: "" });

    const deleteHandler = (deleteID, address) => {
        setDeleteInfo({ id: deleteID, address });
        setOpenConfirm(true);
    };

    const complainColumns = [
        { id: 'user',      label: 'User',      minWidth: 170 },
        { id: 'complaint', label: 'Complaint', minWidth: 250 },
        { id: 'date',      label: 'Date',      minWidth: 140 },
    ];

    const complainRows =
        Array.isArray(complainsList) && complainsList.length > 0
            ? complainsList.map((complain) => {
                const date = new Date(complain.date);
                const dateString =
                    date.toString() !== "Invalid Date"
                        ? date.toISOString().substring(0, 10)
                        : "Invalid Date";
                return {
                    user:      complain.user?.name || "Unknown User",
                    complaint: complain.complaint,
                    date:      dateString,
                    id:        complain._id,
                };
            })
            : [];

    const ComplainButtonHaver = ({ row }) => (
        <IconButton
            onClick={() => deleteHandler(row.id, "Complain")}
            sx={{
                color: "#ef4444",
                "&:hover": { background: "rgba(239,68,68,0.08)" },
            }}
        >
            <DeleteIcon />
        </IconButton>
    );

    if (loading) {
        return (
            <Box sx={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress sx={{ color: "#4f46e5" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Page Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 52, height: 52,
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
                        }}
                    >
                        <ComplainIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="#0f172a">
                            Student Complaints
                        </Typography>
                        <Typography color="#64748b" fontSize="0.88rem">
                            {complainRows.length} complaint{complainRows.length !== 1 ? "s" : ""} submitted
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={`${complainRows.length} Total`}
                    sx={{
                        background: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        px: 1,
                    }}
                />
            </Box>

            {/* Empty or Table */}
            {response || complainRows.length === 0 ? (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: "center",
                        borderRadius: "20px",
                        background: "rgba(239,68,68,0.02)",
                        border: "1px dashed rgba(239,68,68,0.15)",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 72, height: 72,
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            mx: "auto", mb: 2,
                        }}
                    >
                        <ResolvedIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        No Complaints Found 🎉
                    </Typography>
                    <Typography color="#64748b">
                        All is well! There are no complaints submitted by students.
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: "20px",
                        boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
                    }}
                >
                    <Box sx={{ p: 2.5, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <PersonIcon sx={{ color: "#4f46e5" }} />
                        <Typography fontWeight={700} color="#0f172a">
                            All Submitted Complaints
                        </Typography>
                    </Box>
                    <TableTemplate
                        buttonHaver={ComplainButtonHaver}
                        columns={complainColumns}
                        rows={complainRows}
                    />
                </Paper>
            )}
            <ConfirmModal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => {
                    dispatch(deleteUser(deleteInfo.id, deleteInfo.address)).then(() => {
                        dispatch(getAllComplains(currentUser._id, "Complain"));
                    });
                }}
            />
        </Box>
    );
};

export default SeeComplains;