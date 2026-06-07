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

import Popup from '../../../components/Popup';
import { BlueButton } from '../../../components/buttonStyles';

const StudentExamMarks = ({ situation }) => {
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
    const [marksObtained, setMarksObtained] = useState("");

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
        marksObtained,
    };

    const submitHandler = (event) => {
        event.preventDefault();

        setLoader(true);

        dispatch(
            updateStudentFields(
                studentID,
                fields,
                "UpdateExamResult"
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
                "Marks added successfully"
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
                    justifyContent: "center",
                    alignItems: "center",
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
                        Student Marks
                    </Typography>

                    <Typography
                        color="#64748b"
                        mb={4}
                    >
                        Enter examination marks
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

                            <TextField
                                fullWidth
                                type="number"
                                label="Marks Obtained"
                                value={
                                    marksObtained
                                }
                                onChange={(
                                    e
                                ) =>
                                    setMarksObtained(
                                        e.target
                                            .value
                                    )
                                }
                                inputProps={{
                                    min: 0,
                                }}
                                required
                            />
                        </Stack>

                        <BlueButton
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
                                "Submit Marks"
                            )}
                        </BlueButton>
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

export default StudentExamMarks;