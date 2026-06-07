import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Popup from "../../components/Popup";
import { BlueButton } from "../../components/buttonStyles";
import { addStuff } from "../../redux/userRelated/userHandle";

const StudentComplain = () => {
    const dispatch = useDispatch();

    const { status, currentUser, error } =
        useSelector((state) => state.user);

    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] =
        useState(false);

    const fields = {
        user: currentUser?._id,
        school: currentUser?.school?._id,
        complaint,
        date,
    };

    const submitHandler = (event) => {
        event.preventDefault();

        setLoader(true);

        dispatch(
            addStuff(fields, "Complain")
        );
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);

            setComplaint("");

            setShowPopup(true);
            setMessage(
                "Complaint submitted successfully."
            );
        } else if (error) {
            setLoader(false);

            setShowPopup(true);
            setMessage("Network Error");
        }
    }, [status, error]);

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
                        maxWidth: 700,
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
                        Submit Complaint
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Share any issue or concern
                        with the administration.
                    </Typography>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Complaint"
                                placeholder="Describe your issue..."
                                multiline
                                rows={5}
                                value={complaint}
                                onChange={(e) =>
                                    setComplaint(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </Stack>

                        <BlueButton
                            fullWidth
                            size="large"
                            sx={{
                                mt: 4,
                                py: 1.5,
                                borderRadius:
                                    "12px",
                            }}
                            variant="contained"
                            type="submit"
                            disabled={loader}
                        >
                            {loader ? (
                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />
                            ) : (
                                "Submit Complaint"
                            )}
                        </BlueButton>
                    </form>
                </Paper>
            </Box>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </>
    );
};

export default StudentComplain;