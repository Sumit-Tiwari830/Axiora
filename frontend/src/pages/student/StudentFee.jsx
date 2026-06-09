import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StudentFee = () => {
    const { currentUser } = useSelector(state => state.user);
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                // If currentUser.school is an object, use its _id, otherwise it might be the ID string
                const schoolId = typeof currentUser.school === 'object' ? currentUser.school._id : currentUser.school;
                const classId = typeof currentUser.sclassName === 'object' ? currentUser.sclassName._id : currentUser.sclassName;

                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeesList/${schoolId}`);
                if (Array.isArray(res.data)) {
                    const classFees = res.data.filter(f => f.sclassName?._id === classId || f.sclassName === classId);
                    setFees(classFees);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFees();
    }, [currentUser]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (fee) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const orderRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/razorpay/order`, {
                amount: fee.feeAmount,
                currency: "INR"
            });
            const { id: order_id, amount, currency } = orderRes.data;

            const options = {
                key: "dummy_key", // Use real key in production
                amount: amount.toString(),
                currency: currency,
                name: "Axiora School",
                description: fee.feeDetails,
                order_id: order_id,
                handler: async function (response) {
                    const data = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        studentId: currentUser._id,
                        feeId: fee._id,
                        amountPaid: fee.feeAmount
                    };

                    const verifyRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/razorpay/verify`, data);
                    if (verifyRes.data.message === "Payment successful") {
                        alert("Payment successful!");
                        window.location.reload();
                    }
                },
                prefill: {
                    name: currentUser.name,
                    email: "student@axiora.edu",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563eb"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    const isFeePaid = (feeId) => {
        return currentUser.feePayments?.some(payment => payment.feeId === feeId && payment.status === 'Paid');
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={4}>Fee Details</Typography>
            <Grid container spacing={3}>
                {fees.map(fee => {
                    const paid = isFeePaid(fee._id);
                    return (
                        <Grid item xs={12} md={6} key={fee._id}>
                            <Card sx={{ boxShadow: 3, borderRadius: '16px' }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary">{fee.feeDetails}</Typography>
                                    <Typography variant="body1" mt={1}>Amount: ₹{fee.feeAmount}</Typography>
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        Due Date: {new Date(fee.dueDate).toLocaleDateString()}
                                    </Typography>
                                    <Box mt={3}>
                                        {paid ? (
                                            <Button variant="contained" color="success" disabled>
                                                Paid
                                            </Button>
                                        ) : (
                                            <Button variant="contained" color="primary" onClick={() => handlePayment(fee)}>
                                                Pay Now
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            {fees.length === 0 && <Typography>No fees found for your class.</Typography>}
        </Box>
    );
};

export default StudentFee;
