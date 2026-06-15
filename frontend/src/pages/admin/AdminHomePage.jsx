import { Container, Grid, Paper, Typography, Box, Avatar } from "@mui/material";
import {
    People as PeopleIcon,
    School as SchoolIcon,
    PersonOutline as PersonIcon,
    TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import SeeNotice from "../../components/SeeNotice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";

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
        label: "Total Students",
        icon: PeopleIcon,
        gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        lightBg: "rgba(79, 70, 229, 0.08)",
    },
    {
        label: "Total Classes",
        icon: SchoolIcon,
        gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
        lightBg: "rgba(6, 182, 212, 0.08)",
    },
    {
        label: "Total Teachers",
        icon: PersonIcon,
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        lightBg: "rgba(16, 185, 129, 0.08)",
    },
    {
        label: "Active Users",
        icon: TrendingIcon,
        gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
        lightBg: "rgba(245, 158, 11, 0.08)",
    },
];

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const adminID = currentUser?._id;

    useEffect(() => {
        if (adminID) {
            dispatch(getAllStudents(adminID));
            dispatch(getAllSclasses(adminID, "Sclass"));
            dispatch(getAllTeachers(adminID));
        }
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList?.length || 0;
    const numberOfClasses = sclassesList?.length || 0;
    const numberOfTeachers = teachersList?.length || 0;

    const animStudents = useAnimatedCount(numberOfStudents);
    const animClasses = useAnimatedCount(numberOfClasses);
    const animTeachers = useAnimatedCount(numberOfTeachers);
    const animActive = useAnimatedCount(numberOfStudents + numberOfTeachers);

    const counts = [animStudents, animClasses, animTeachers, animActive];

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
                {/* Decorative circles */}
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "absolute", bottom: -60, right: 100, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", mb: 0.5, display: "block" }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#fff" }}>
                        Welcome back, {currentUser?.name || "Admin"} 👋
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
                        Here's an overview of your school management system.
                    </Typography>
                </Box>
            </Paper>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statConfig.map((stat, index) => {
                    const Icon = stat.icon;
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
                                        boxShadow: `0 12px 32px rgba(79, 70, 229, 0.12)`,
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        background: stat.gradient,
                                        boxShadow: `0 4px 14px rgba(0,0,0,0.15)`,
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
                                        {counts[index]}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Notices Section */}
            <Paper
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: "16px",
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    📋 Recent Notices
                </Typography>
                <SeeNotice />
            </Paper>
        </Container>
    );
};

export default AdminHomePage;