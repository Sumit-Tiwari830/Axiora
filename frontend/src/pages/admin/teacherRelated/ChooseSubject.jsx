import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';

import {
    GreenButton,
    PurpleButton,
} from '../../../components/buttonStyles';

import {
    StyledTableCell,
    StyledTableRow,
} from '../../../components/styles';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);

    const {
        subjectsList,
        loading,
        error,
        response,
    } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            const classID = params.id;

            setClassID(classID);

            dispatch(
                getTeacherFreeClassSubjects(classID)
            );
        } else if (situation === "Teacher") {
            const { classID, teacherID } = params;

            setClassID(classID);
            setTeacherID(teacherID);

            dispatch(
                getTeacherFreeClassSubjects(classID)
            );
        }
    }, [dispatch, params, situation]);

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
                Loading Subjects...
            </Box>
        );
    }

    if (response) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: 8,
                }}
            >
                <Typography
                    variant="h5"
                    mb={3}
                >
                    All subjects already have teachers assigned
                </Typography>

                <PurpleButton
                    variant="contained"
                    onClick={() =>
                        navigate(
                            "/Admin/addsubject/" +
                            classID
                        )
                    }
                >
                    Add New Subject
                </PurpleButton>
            </Box>
        );
    }

    if (error) {
        console.log(error);
    }

    const updateSubjectHandler = async (
        teacherId,
        teachSubject
    ) => {
        try {
            setLoader(true);

            await dispatch(
                updateTeachSubject(
                    teacherId,
                    teachSubject
                )
            );

            navigate("/Admin/teachers");
        } catch (err) {
            console.log(err);
            setLoader(false);
        }
    };

    return (
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: "20px",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
            }}
        >
            <Box
                sx={{
                    p: 3,
                    borderBottom:
                        "1px solid #e2e8f0",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Choose Subject
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        color: "#64748b",
                    }}
                >
                    Select a subject for the teacher.
                </Typography>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>
                                #
                            </StyledTableCell>

                            <StyledTableCell align="center">
                                Subject Name
                            </StyledTableCell>

                            <StyledTableCell align="center">
                                Subject Code
                            </StyledTableCell>

                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>

                    <TableBody>
                        {Array.isArray(subjectsList) &&
                            subjectsList.length > 0 &&
                            subjectsList.map(
                                (
                                    subject,
                                    index
                                ) => (
                                    <StyledTableRow
                                        key={
                                            subject._id
                                        }
                                    >
                                        <StyledTableCell>
                                            {index + 1}
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            {
                                                subject.subName
                                            }
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            {
                                                subject.subCode
                                            }
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            {situation ===
                                                "Norm" ? (
                                                <GreenButton
                                                    variant="contained"
                                                    onClick={() =>
                                                        navigate(
                                                            "/Admin/teachers/addteacher/" +
                                                            subject._id
                                                        )
                                                    }
                                                >
                                                    Choose
                                                </GreenButton>
                                            ) : (
                                                <GreenButton
                                                    variant="contained"
                                                    disabled={
                                                        loader
                                                    }
                                                    onClick={() =>
                                                        updateSubjectHandler(
                                                            teacherID,
                                                            subject._id
                                                        )
                                                    }
                                                >
                                                    {loader ? (
                                                        <CircularProgress
                                                            size={
                                                                20
                                                            }
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        "Choose Subject"
                                                    )}
                                                </GreenButton>
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ChooseSubject;