import { useEffect, useState } from "react";
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

const TeacherComplain = () => {
    const dispatch = useDispatch();

    const { status, currentUser, error } = useSelector(
        (state) => state.user
    );

    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const user = currentUser?._id;
    const school = currentUser?.school?._id;

    const fields = {
        user,
        date,
        complaint,
        school,
    };

    const address = "Complain";

    const submitHandler = (event) => {
        event.preventDefault();

        setLoader(true);

        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false);

            setComplaint("");
            setDate("");

            setMessage("Complaint submitted successfully");
            setShowPopup(true);
        } else if (error) {
            setLoader(false);

            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, error]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
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
                        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
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
                        Report any issue or concern to the administration.
                    </Typography>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                label="Complaint"
                                placeholder="Write your complaint here..."
                                value={complaint}
                                onChange={(e) =>
                                    setComplaint(e.target.value)
                                }
                                required
                            />

                            <BlueButton
                                type="submit"
                                variant="contained"
                                size="large"
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
                        </Stack>
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

export default TeacherComplain;