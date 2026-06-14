import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
} from "@mui/material";
import {
    MenuBook as SubjectIcon,
    Assignment as AssignmentIcon,
    EventAvailable as AttendanceIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import SeeNotice from "../../components/SeeNotice";

import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";

const useAnimatedCount = (target, duration = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!target) { setCount(0); return; }
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
};

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

    const numberOfSubjects = subjectsList?.length || 0;
    const animSubjects = useAnimatedCount(numberOfSubjects);
    const animAssignments = useAnimatedCount(15);

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

    const statCards = [
        {
            label: "Total Subjects",
            value: animSubjects,
            icon: SubjectIcon,
            gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        },
        {
            label: "Assignments",
            value: animAssignments,
            icon: AssignmentIcon,
            gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }} className="animate-fadeInUp">
            {/* Welcome Banner */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    border: "none",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "absolute", bottom: -60, right: 100, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", mb: 0.5, display: "block" }}>
                        Student Dashboard
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#fff" }}>
                        Welcome, {currentUser?.name} 👋
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                        Track your subjects, attendance, and academic progress.
                    </Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {/* Stat Cards */}
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={stat.label}>
                            <Paper
                                className={`animate-fadeInUp delay-${(index + 1) * 100}`}
                                sx={{
                                    p: 3,
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2.5,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 32px rgba(79, 70, 229, 0.12)",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        background: stat.gradient,
                                        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    <Icon sx={{ fontSize: 28, color: "#fff" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.8rem", mb: 0.3 }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "1.75rem",
                                            fontWeight: 800,
                                            background: stat.gradient,
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}

                {/* Attendance Chart */}
                <Grid item xs={12} md={4}>
                    <Paper
                        className="animate-fadeInUp delay-300"
                        sx={{
                            p: 2,
                            borderRadius: "16px",
                            height: "100%",
                            minHeight: 180,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b", mb: 1 }}>
                            Attendance
                        </Typography>
                        {response ? (
                            <Typography color="text.secondary">No Attendance Found</Typography>
                        ) : loading ? (
                            <Typography color="text.secondary">Loading...</Typography>
                        ) : subjectAttendance?.length > 0 ? (
                            <CustomPieChart data={chartData} />
                        ) : (
                            <Typography color="text.secondary">No Attendance Found</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Attendance Summary */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                background: overallAttendancePercentage >= 70
                                    ? "linear-gradient(135deg, #10b981, #059669)"
                                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                            }}
                        >
                            <AttendanceIcon sx={{ color: "#fff" }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Attendance Overview
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                Overall Attendance:{" "}
                                <Box component="span" sx={{ fontWeight: 700, color: overallAttendancePercentage >= 70 ? "#10b981" : "#ef4444" }}>
                                    {overallAttendancePercentage.toFixed(2)}%
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Notices */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: "16px",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            📋 Latest Notices
                        </Typography>
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentHomePage;