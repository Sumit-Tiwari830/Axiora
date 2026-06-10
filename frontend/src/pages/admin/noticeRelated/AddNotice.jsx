import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormLabel
} from '@mui/material';

import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const AddNotice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, response, error, currentUser } =
        useSelector((state) => state.user);

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [date, setDate] = useState("");
    
    const [isGlobal, setIsGlobal] = useState(true);
    const [targetClasses, setTargetClasses] = useState([]);

    const [loader, setLoader] = useState(false);

    const { sclassesList } = useSelector((state) => state.sclass);

    const [showPopup, setShowPopup] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const adminID = currentUser._id;

    const fields = {
        title,
        details,
        date,
        adminID,
        isGlobal,
        targetClasses
    };

    const address = "Notice";

    const submitHandler = (event) => {
        event.preventDefault();

        setLoader(true);

        dispatch(
            addStuff(fields, address)
        );
    };

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const handleClassChange = (event) => {
        const value = event.target.value;
        if (value === "all") {
            setIsGlobal(event.target.checked);
            if (event.target.checked) setTargetClasses([]);
        } else {
            if (event.target.checked) {
                setTargetClasses([...targetClasses, value]);
                setIsGlobal(false);
            } else {
                setTargetClasses(targetClasses.filter(id => id !== value));
            }
        }
    };

    useEffect(() => {
        if (status === "added") {
            dispatch(underControl());

            navigate("/Admin/notices");
        } else if (status === "failed") {
            setMessage(
                response ||
                "Failed to create notice"
            );

            setShowPopup(true);

            setLoader(false);
        } else if (status === "error") {
            setMessage("Network Error");

            setShowPopup(true);

            setLoader(false);
        }
    }, [
        status,
        response,
        error,
        navigate,
        dispatch,
    ]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "80vh",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 650,
                        p: 4,
                        borderRadius: "24px",
                        background: "#fff",
                        boxShadow:
                            "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mb={1}
                    >
                        Add Notice
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Create and publish a new notice.
                    </Typography>

                    <form
                        onSubmit={
                            submitHandler
                        }
                    >
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Title"
                            placeholder="Enter notice title..."
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            label="Details"
                            placeholder="Enter notice details..."
                            value={details}
                            onChange={(e) =>
                                setDetails(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={date}
                            onChange={(e) =>
                                setDate(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <Box sx={{ mt: 2, mb: 2 }}>
                            <FormLabel component="legend">Target Classes</FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isGlobal}
                                            onChange={handleClassChange}
                                            value="all"
                                        />
                                    }
                                    label="All Classes"
                                />
                                {sclassesList && sclassesList.map((sclass) => (
                                    <FormControlLabel
                                        key={sclass._id}
                                        control={
                                            <Checkbox
                                                checked={targetClasses.includes(sclass._id)}
                                                onChange={handleClassChange}
                                                value={sclass._id}
                                                disabled={isGlobal}
                                            />
                                        }
                                        label={sclass.sclassName}
                                    />
                                ))}
                            </FormGroup>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loader}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius:
                                    "12px",
                                background:
                                    "linear-gradient(135deg,#2563eb,#7c3aed)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#1d4ed8,#6d28d9)",
                                },
                            }}
                        >
                            {loader ? (
                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />
                            ) : (
                                "Publish Notice"
                            )}
                        </Button>
                    </form>
                </Paper>
            </Box>

            <Popup
                message={message}
                setShowPopup={
                    setShowPopup
                }
                showPopup={showPopup}
            />
        </>
    );
};

export default AddNotice;