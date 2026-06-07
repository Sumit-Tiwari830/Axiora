import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Stack,
    TextField,
    CircularProgress,
    FormControl,
    Paper,
} from '@mui/material';

import { PurpleButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const params = useParams();

    const {
        currentUser,
        userDetails,
        loading,
    } = useSelector((state) => state.user);

    const {
        subjectsList,
    } = useSelector((state) => state.sclass);

    const {
        response,
        error,
        statestatus,
    } = useSelector((state) => state.student);

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (situation === "Student") {
            const stdID = params.id;

            setStudentID(stdID);

            dispatch(
                getUserDetails(
                    stdID,
                    "Student"
                )
            );
        } else if (situation === "Subject") {
            const {
                studentID,
                subjectID,
            } = params;

            setStudentID(studentID);

            dispatch(
                getUserDetails(
                    studentID,
                    "Student"
                )
            );

            setChosenSubName(subjectID);
        }
    }, [dispatch, params, situation]);

    useEffect(() => {
        if (
            userDetails?.sclassName?._id &&
            situation === "Student"
        ) {
            dispatch(
                getSubjectList(
                    userDetails.sclassName._id,
                    "ClassSubjects"
                )
            );
        }
    }, [dispatch, userDetails, situation]);

    const changeHandler = (event) => {
        const selectedSubject =
            subjectsList?.find(
                (subject) =>
                    subject.subName ===
                    event.target.value
            );

        if (!selectedSubject) return;

        setSubjectName(
            selectedSubject.subName
        );

        setChosenSubName(
            selectedSubject._id
        );
    };

    const fields = {
        subName: chosenSubName,
        status,
        date,
    };

    const submitHandler = (event) => {
        event.preventDefault();

        setLoader(true);

        dispatch(
            updateStudentFields(
                studentID,
                fields,
                "StudentAttendance"
            )
        );
    };

    useEffect(() => {
        if (response) {
            setLoader(false);
            setMessage(response);
            setShowPopup(true);
        } else if (error) {
            setLoader(false);
            setMessage("Something went wrong");
            setShowPopup(true);
        } else if (
            statestatus === "added"
        ) {
            setLoader(false);
            setMessage(
                "Attendance added successfully"
            );
            setShowPopup(true);
        }
    }, [
        response,
        error,
        statestatus,
    ]);

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#64748b",
                }}
            >
                Loading Student...
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    minHeight:
                        "80vh",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 650,
                        p: 4,
                        borderRadius:
                            "24px",
                        background:
                            "#fff",
                        boxShadow:
                            "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        mb={1}
                    >
                        Student Attendance
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Record student
                        attendance
                    </Typography>

                    <Stack
                        spacing={1}
                        sx={{ mb: 4 }}
                    >
                        <Typography variant="h6">
                            Student:
                            {" "}
                            {userDetails?.name}
                        </Typography>

                        {currentUser?.teachSubject && (
                            <Typography variant="h6">
                                Subject:
                                {" "}
                                {
                                    currentUser
                                        .teachSubject
                                        ?.subName
                                }
                            </Typography>
                        )}
                    </Stack>

                    <form
                        onSubmit={
                            submitHandler
                        }
                    >
                        <Stack spacing={3}>
                            {situation ===
                                "Student" && (
                                    <FormControl fullWidth>
                                        <InputLabel>
                                            Select Subject
                                        </InputLabel>

                                        <Select
                                            value={
                                                subjectName
                                            }
                                            label="Select Subject"
                                            onChange={
                                                changeHandler
                                            }
                                            required
                                        >
                                            {subjectsList?.map(
                                                (
                                                    subject
                                                ) => (
                                                    <MenuItem
                                                        key={
                                                            subject._id
                                                        }
                                                        value={
                                                            subject.subName
                                                        }
                                                    >
                                                        {
                                                            subject.subName
                                                        }
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                )}

                            <FormControl fullWidth>
                                <InputLabel>
                                    Attendance Status
                                </InputLabel>

                                <Select
                                    value={
                                        status
                                    }
                                    label="Attendance Status"
                                    onChange={(
                                        event
                                    ) =>
                                        setStatus(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                >
                                    <MenuItem value="Present">
                                        Present
                                    </MenuItem>

                                    <MenuItem value="Absent">
                                        Absent
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Attendance Date"
                                type="date"
                                value={date}
                                onChange={(
                                    event
                                ) =>
                                    setDate(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                fullWidth
                            />
                        </Stack>

                        <PurpleButton
                            fullWidth
                            size="large"
                            sx={{
                                mt: 4,
                                py: 1.5,
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
                                "Submit Attendance"
                            )}
                        </PurpleButton>
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

export default StudentAttendance;