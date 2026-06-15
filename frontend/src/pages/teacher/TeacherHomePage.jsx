import { Container, Grid, Paper, Typography, Box, Avatar } from "@mui/material";
import {
    People as PeopleIcon,
    CalendarMonth as SessionIcon,
    MenuBook as SubjectIcon,
    AccessTime as TimeIcon,
} from "@mui/icons-material";
import SeeNotice from "../../components/SeeNotice";
import {
    getClassStudents,
    getSubjectDetails,
} from "../../redux/sclassRelated/sclassHandle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

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

const statConfig = [
    {
        label: "Class Students",
        icon: PeopleIcon,
        gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        type: "count",
    },
    {
        label: "Total Sessions",
        icon: SessionIcon,
        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        type: "count",
    },
    {
        label: "Subject Assigned",
        icon: SubjectIcon,
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        type: "text",
    },
    {
        label: "Total Hours",
        icon: TimeIcon,
        gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
        type: "hours",
    },
];

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector(
        (state) => state.user
    );

    const {
        subjectDetails,
        sclassStudents,
    } = useSelector(
        (state) => state.sclass
    );

    const classID =
        currentUser?.teachSclass?._id;

    const subjectID =
        currentUser?.teachSubject?._id;

    useEffect(() => {
        if (subjectID) {
            dispatch(
                getSubjectDetails(
                    subjectID,
                    "Subject"
                )
            );
        }

        if (classID) {
            dispatch(
                getClassStudents(classID)
            );
        }
    }, [
        dispatch,
        subjectID,
        classID,
    ]);

    const numberOfStudents = sclassStudents?.length || 0;
    const numberOfSessions = subjectDetails?.sessions || 0;
    const estimatedHours = numberOfSessions;

    const animStudents = useAnimatedCount(numberOfStudents);
    const animSessions = useAnimatedCount(numberOfSessions);
    const animHours = useAnimatedCount(estimatedHours);

    const subjectName = currentUser?.teachSubject?.subName || "Not Assigned";

    const getStatValue = (index) => {
        switch (index) {
            case 0: return animStudents;
            case 1: return animSessions;
            case 2: return subjectName;
            case 3: return `${animHours} hrs`;
            default: return 0;
        }
    };

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
                        Teacher Dashboard
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#fff" }}>
                        Welcome, {currentUser?.name} 👋
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                        Manage your classes, track attendance, and engage with students.
                    </Typography>
                </Box>
            </Paper>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statConfig.map((stat, index) => {
                    const Icon = stat.icon;
                    const value = getStatValue(index);
                    return (
                        <Grid item xs={12} sm={6} md={3} key={stat.label}>
                            <Paper
                                className={`animate-fadeInUp delay-${(index + 1) * 100}`}
                                sx={{
                                    p: 3,
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2.5,
                                    transition: "all 0.3s ease",
                                    cursor: "default",
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
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.8rem", mb: 0.3 }}
                                    >
                                        {stat.label}
                                    </Typography>
                                    {stat.type === "text" ? (
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#4f46e5" }}>
                                            {value}
                                        </Typography>
                                    ) : (
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
                                            {value}
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Notices Section */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "16px" }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    📋 Latest Notices
                </Typography>
                <SeeNotice />
            </Paper>
        </Container>
    );
};

export default TeacherHomePage;