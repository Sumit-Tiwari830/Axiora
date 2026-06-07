import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from "styled-components";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";

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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <WelcomeSection>
                <Typography variant="h4">
                    Welcome back, {currentUser?.name || "Admin"} 👋
                </Typography>
                <Typography variant="body1">
                    Here's an overview of your school management system.
                </Typography>
            </WelcomeSection>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <img src={Students} alt="students" width="70" />
                        <CardTitle>Students</CardTitle>
                        <CardNumber>
                            <CountUp start={0} end={numberOfStudents} duration={2} />
                        </CardNumber>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <img src={Classes} alt="classes" width="70" />
                        <CardTitle>Classes</CardTitle>
                        <CardNumber>
                            <CountUp start={0} end={numberOfClasses} duration={2} />
                        </CardNumber>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <img src={Teachers} alt="teachers" width="70" />
                        <CardTitle>Teachers</CardTitle>
                        <CardNumber>
                            <CountUp start={0} end={numberOfTeachers} duration={2} />
                        </CardNumber>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <img src={Fees} alt="axiora" width="70" />
                        <CardTitle>Active Users</CardTitle>
                        <CardNumber>
                            <CountUp start={0} end={numberOfStudents + numberOfTeachers} duration={2} />
                        </CardNumber>
                    </StatCard>
                </Grid>

                <Grid item xs={12}>
                    <NoticeCard>
                        <NoticeHeader>Recent Notices</NoticeHeader>
                        <SeeNotice />
                    </NoticeCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminHomePage;

const WelcomeSection = styled(Box)`
    margin-bottom: 30px;
    h4 {
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
    }
    p {
        color: #64748b;
    }
`;

const StatCard = styled(Paper)`
    padding: 24px;
    border-radius: 24px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 220px;
    background: white !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06) !important;
    transition: 0.3s ease !important;
    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15) !important;
    }
`;

const CardTitle = styled.h3`
    margin-top: 15px;
    margin-bottom: 10px;
    color: #475569;
    font-weight: 600;
`;

const CardNumber = styled.div`
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const NoticeCard = styled(Paper)`
    padding: 24px;
    border-radius: 24px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06) !important;
`;

const NoticeHeader = styled.h2`
    margin-bottom: 20px;
    color: #0f172a;
    font-weight: 700;
`;