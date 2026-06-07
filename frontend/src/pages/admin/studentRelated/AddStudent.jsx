import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
} from "@mui/material";

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState("");
    const [rollNum, setRollNum] = useState("");
    const [password, setPassword] = useState("");
    const [className, setClassName] = useState("");
    const [sclassName, setSclassName] = useState("");

    const adminID = currentUser?._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList?.find(
                (c) => c.sclassName === event.target.value
            );

            if (!selectedClass) return;

            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    }

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance }

    const submitHandler = (event) => {
        event.preventDefault()
        if (sclassName === "") {
            setMessage("Please select a class.")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

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
                        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mb={1}
                    >
                        Add Student
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Create a new student account
                    </Typography>

                    <form onSubmit={submitHandler}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Name"
                            placeholder="Enter student's name..."
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            required
                        />

                        {situation === "Student" && (
                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                label="Class"
                                value={className}
                                onChange={changeHandler}
                                required
                            >
                                <MenuItem value="Select Class">
                                    Select Class
                                </MenuItem>
                                {sclassesList?.map((c) => (
                                    <MenuItem
                                        key={c._id}
                                        value={c.sclassName}
                                    >
                                        {c.sclassName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Roll Number"
                            type="number"
                            placeholder="Enter student's Roll Number..."
                            value={rollNum}
                            onChange={(event) => setRollNum(event.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            type="password"
                            placeholder="Enter student's password..."
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loader}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                                "&:hover": {
                                    background: "linear-gradient(135deg,#1d4ed8,#6d28d9)",
                                }
                            }}
                        >
                            {loader ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Add Student'
                            )}
                        </Button>
                    </form>
                </Paper>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent;