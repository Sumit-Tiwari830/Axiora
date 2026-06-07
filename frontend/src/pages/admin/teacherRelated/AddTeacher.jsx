import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material';

const AddTeacher = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const subjectID = params.id

    const { status, response, error } = useSelector(state => state.user);
    const { subjectDetails } = useSelector((state) => state.sclass);

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
    }, [dispatch, subjectID]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const role = "Teacher"
    const school = subjectDetails?.school;
    const teachSubject = subjectDetails?._id;
    const teachSclass = subjectDetails?.sclassName?._id;

    const fields = { name, email, password, role, school, teachSubject, teachSclass }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(registerUser(fields, role))
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate("/Admin/teachers")
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
                        mx: 2,
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
                        Add Teacher
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Create a new teacher account
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <Typography fontWeight={600}>
                            Subject: {subjectDetails?.subName || "-"}
                        </Typography>

                        <Typography mt={1}>
                            Class: {subjectDetails?.sclassName?.sclassName || "-"}
                        </Typography>
                    </Box>

                    <form onSubmit={submitHandler}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Teacher Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={loader}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: "12px",
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
                                "Register Teacher"
                            )}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{
                                mt: 2,
                                borderRadius: "12px",
                            }}
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
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
}

export default AddTeacher