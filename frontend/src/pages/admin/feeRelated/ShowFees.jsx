import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, Button, IconButton
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import TableTemplate from '../../../components/TableTemplate';

const ShowFees = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/FeesList/${currentUser._id}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setFees(res.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [currentUser._id]);

    const feeColumns = [
        { id: 'details', label: 'Fee Details', minWidth: 170 },
        { id: 'amount', label: 'Amount', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
        { id: 'dueDate', label: 'Due Date', minWidth: 170 },
    ];

    const feeRows = fees.map((fee) => {
        return {
            details: fee.feeDetails,
            amount: `₹${fee.feeAmount}`,
            sclassName: fee.sclassName?.sclassName || 'Unknown',
            dueDate: new Date(fee.dueDate).toLocaleDateString(),
            id: fee._id,
        };
    });

    const FeeButtonHaver = ({ row }) => {
        return (
            <IconButton onClick={() => navigate(`/Admin/fees/fee/${row.id}`)} color="primary">
                <VisibilityIcon />
            </IconButton>
        );
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Fees Management</Typography>
                <Button variant="contained" onClick={() => navigate('/Admin/addfee')}>Add Fee</Button>
            </Box>
            
            {loading ? (
                <Typography>Loading fees...</Typography>
            ) : fees.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableTemplate buttonHaver={FeeButtonHaver} columns={feeColumns} rows={feeRows} />
                </Paper>
            ) : (
                <Typography>No fees have been created yet.</Typography>
            )}
        </Box>
    );
};

export default ShowFees;
