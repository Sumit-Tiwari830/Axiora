import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import TableTemplate from '../../../components/TableTemplate';

const ViewFee = () => {
    const { id } = useParams();
    const [fee, setFee] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeeAndStudents = async () => {
            try {
                // 1. Fetch fee details
                const feeRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/Fee/${id}`);
                const feeData = feeRes.data;
                setFee(feeData);

                if (feeData && feeData.sclassName) {
                    // 2. Fetch students of that class
                    const sclassId = typeof feeData.sclassName === 'object' ? feeData.sclassName._id : feeData.sclassName;
                    const studentRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/Sclass/Students/${sclassId}`);
                    
                    if (Array.isArray(studentRes.data)) {
                        setStudents(studentRes.data);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeAndStudents();
    }, [id]);

    const studentColumns = [
        { id: 'name', label: 'Student Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'status', label: 'Payment Status', minWidth: 170 },
    ];

    const studentRows = students.map(student => {
        const isPaid = student.feePayments?.some(payment => payment.feeId === id && payment.status === 'Paid');
        
        return {
            name: student.name,
            rollNum: student.rollNum,
            status: isPaid ? 'Paid' : 'Pending',
            id: student._id
        };
    });

    const StatusButtonHaver = ({ row }) => {
        const isPaid = row.status === 'Paid';
        return (
            <Typography sx={{ color: isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
                {row.status}
            </Typography>
        );
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    if (!fee) {
        return <Box sx={{ p: 3 }}><Typography>Fee not found.</Typography></Box>;
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Fee Details: {fee.feeDetails}</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>Amount: ₹{fee.feeAmount}</Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>Due Date: {new Date(fee.dueDate).toLocaleDateString()}</Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Students Payment Status</Typography>
            
            {students.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableTemplate buttonHaver={StatusButtonHaver} columns={studentColumns} rows={studentRows} />
                </Paper>
            ) : (
                <Typography>No students found in this class.</Typography>
            )}
        </Box>
    );
};

export default ViewFee;
