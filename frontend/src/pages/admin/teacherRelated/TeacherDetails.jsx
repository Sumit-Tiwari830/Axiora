import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Divider,
} from '@mui/material';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const { loading, teacherDetails, error } = useSelector(
        (state) => state.teacher
    );

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent =
        teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(
            `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 750,
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    sx={{
                        p: 4,
                        background:
                            "linear-gradient(135deg,#2563eb,#7c3aed)",
                        color: "#fff",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Teacher Profile
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            opacity: 0.9,
                        }}
                    >
                        Teacher information and assignment details
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={3}
                    >
                        Basic Information
                    </Typography>

                    <Box mb={2}>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Teacher Name
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            {teacherDetails?.name || "-"}
                        </Typography>
                    </Box>

                    <Box mb={3}>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Assigned Class
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            {teacherDetails?.teachSclass?.sclassName ||
                                "Not Assigned"}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={3}
                    >
                        Subject Information
                    </Typography>

                    {isSubjectNamePresent ? (
                        <>
                            <Box mb={2}>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Subject Name
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {
                                        teacherDetails
                                            ?.teachSubject
                                            ?.subName
                                    }
                                </Typography>
                            </Box>

                            <Box mb={4}>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Total Sessions
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                >
                                    {
                                        teacherDetails
                                            ?.teachSubject
                                            ?.sessions
                                    }
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleAddSubject}
                            sx={{
                                borderRadius: "12px",
                                py: 1.3,
                                px: 3,
                                background:
                                    "linear-gradient(135deg,#2563eb,#7c3aed)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#1d4ed8,#6d28d9)",
                                },
                            }}
                        >
                            Assign Subject
                        </Button>
                    )}

                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            sx={{
                                borderRadius: "12px",
                            }}
                        >
                            Go Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    "/Admin/teachers"
                                )
                            }
                            sx={{
                                borderRadius: "12px",
                            }}
                        >
                            All Teachers
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default TeacherDetails;