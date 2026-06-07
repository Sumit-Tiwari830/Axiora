import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CountUp from "react-countup";

import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import SeeNotice from "../../components/SeeNotice";

import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";

import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";

const StudentHomePage = () => {
    const dispatch = useDispatch();

    const {
        userDetails,
        currentUser,
        loading,
        response,
    } = useSelector((state) => state.user);

    const { subjectsList } = useSelector(
        (state) => state.sclass
    );

    const [subjectAttendance, setSubjectAttendance] =
        useState([]);

    const classID =
        currentUser?.sclassName?._id;

    useEffect(() => {
        if (!currentUser?._id || !classID) return;

        dispatch(
            getUserDetails(
                currentUser._id,
                "Student"
            )
        );

        dispatch(
            getSubjectList(
                classID,
                "ClassSubjects"
            )
        );
    }, [
        dispatch,
        currentUser?._id,
        classID,
    ]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(
                userDetails.attendance || []
            );
        }
    }, [userDetails]);

    const numberOfSubjects =
        subjectsList?.length || 0;

    const overallAttendancePercentage =
        calculateOverallAttendancePercentage(
            subjectAttendance
        );

    const overallAbsentPercentage =
        100 -
        overallAttendancePercentage;

    const chartData = [
        {
            name: "Present",
            value: overallAttendancePercentage,
        },
        {
            name: "Absent",
            value: overallAbsentPercentage,
        },
    ];

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 3,
                mb: 4,
            }}
        >
            {/* Welcome Card */}

            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: "24px",
                    background:
                        "linear-gradient(135deg,#2563eb,#7c3aed)",
                    color: "#fff",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Welcome,
                    {" "}
                    {currentUser?.name}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        opacity: 0.9,
                    }}
                >
                    Manage your subjects,
                    attendance and notices.
                </Typography>
            </Paper>

            <Grid
                container
                spacing={3}
            >
                {/* Subjects */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <StyledPaper>
                        <img
                            src={Subject}
                            alt="Subjects"
                            width={70}
                        />

                        <Title>
                            Total Subjects
                        </Title>

                        <Data
                            start={0}
                            end={
                                numberOfSubjects
                            }
                            duration={2}
                        />
                    </StyledPaper>
                </Grid>

                {/* Assignments */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <StyledPaper>
                        <img
                            src={Assignment}
                            alt="Assignments"
                            width={70}
                        />

                        <Title>
                            Assignments
                        </Title>

                        <Data
                            start={0}
                            end={15}
                            duration={2}
                        />
                    </StyledPaper>
                </Grid>

                {/* Attendance */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Paper
                        sx={{
                            p: 2,
                            height: 220,
                            borderRadius:
                                "20px",
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                        }}
                    >
                        {response ? (
                            <Typography>
                                No Attendance
                                Found
                            </Typography>
                        ) : loading ? (
                            <Typography>
                                Loading...
                            </Typography>
                        ) : subjectAttendance?.length >
                            0 ? (
                            <CustomPieChart
                                data={
                                    chartData
                                }
                            />
                        ) : (
                            <Typography>
                                No Attendance
                                Found
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Attendance Summary */}

                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius:
                                "20px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            mb={1}
                        >
                            Attendance
                            Overview
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Overall
                            Attendance:
                            {" "}
                            {overallAttendancePercentage.toFixed(
                                2
                            )}
                            %
                        </Typography>
                    </Paper>
                </Grid>

                {/* Notices */}

                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius:
                                "20px",
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            mb={2}
                        >
                            Latest Notices
                        </Typography>

                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentHomePage;

const StyledPaper = styled(Paper)`
    padding: 20px;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    border-radius: 20px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
`;

const Title = styled.p`
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
`;

const Data = styled(CountUp)`
    font-size: 2rem;
    font-weight: 700;
    color: #2563eb;
`;