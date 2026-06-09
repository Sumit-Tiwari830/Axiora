import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Stack, TextField, Typography, MenuItem } from "@mui/material";
import axios from "axios";
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

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

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);

        const fields = { feeAmount, feeDetails, sclassName, school: currentUser._id, dueDate };

        axios.post(`${process.env.REACT_APP_BASE_URL}/FeeCreate`, fields, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
            navigate(-1);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            setLoader(false);
        });
    };

    return (
        <Box sx={{ flex: '1 1 auto', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 550, px: 3, py: '100px', width: '100%' }}>
                <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="h4">Add Fee Notice</Typography>
                </Stack>
                <form onSubmit={submitHandler}>
                    <Stack spacing={3}>
                        <TextField
                            label="Fee Details"
                            variant="outlined"
                            value={feeDetails}
                            onChange={(event) => setFeeDetails(event.target.value)}
                            required
                        />
                        <TextField
                            label="Fee Amount"
                            type="number"
                            variant="outlined"
                            value={feeAmount}
                            onChange={(event) => setFeeAmount(event.target.value)}
                            required
                        />
                        <TextField
                            select
                            label="Class"
                            value={sclassName}
                            onChange={(event) => setSclassName(event.target.value)}
                            required
                        >
                            <MenuItem value="">Select Class</MenuItem>
                            {sclassesList && sclassesList.map((sclass) => (
                                <MenuItem key={sclass._id} value={sclass._id}>
                                    {sclass.sclassName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Due Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            required
                        />
                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Create Fee Notice"}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default AddFee;
