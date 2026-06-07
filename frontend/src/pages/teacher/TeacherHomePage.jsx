import { Container, Grid, Paper, Typography } from "@mui/material";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import styled from "styled-components";
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import {
    getClassStudents,
    getSubjectDetails,
} from "../../redux/sclassRelated/sclassHandle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

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

    const numberOfStudents =
        sclassStudents?.length || 0;

    const numberOfSessions =
        subjectDetails?.sessions || 0;

    const estimatedHours =
        numberOfSessions;

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                mb: 4,
            }}
        >
            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Teacher Dashboard
            </Typography>

            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StyledPaper>
                        <img
                            src={Students}
                            alt="Students"
                            width="80"
                        />

                        <Title>
                            Class Students
                        </Title>

                        <Data
                            start={0}
                            end={
                                numberOfStudents
                            }
                            duration={2}
                        />
                    </StyledPaper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StyledPaper>
                        <img
                            src={Lessons}
                            alt="Lessons"
                            width="80"
                        />

                        <Title>
                            Total Sessions
                        </Title>

                        <Data
                            start={0}
                            end={
                                numberOfSessions
                            }
                            duration={2}
                        />
                    </StyledPaper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StyledPaper>
                        <img
                            src={Tests}
                            alt="Tests"
                            width="80"
                        />

                        <Title>
                            Subject Assigned
                        </Title>

                        <Typography
                            sx={{
                                fontWeight: 600,
                                color:
                                    "#2563eb",
                                textAlign:
                                    "center",
                            }}
                        >
                            {currentUser
                                ?.teachSubject
                                ?.subName ||
                                "Not Assigned"}
                        </Typography>
                    </StyledPaper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StyledPaper>
                        <img
                            src={Time}
                            alt="Hours"
                            width="80"
                        />

                        <Title>
                            Total Hours
                        </Title>

                        <Data
                            start={0}
                            end={
                                estimatedHours
                            }
                            duration={2}
                            suffix=" hrs"
                        />
                    </StyledPaper>
                </Grid>

                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius:
                                "20px",
                            boxShadow:
                                "0 10px 30px rgba(0,0,0,0.08)",
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

const StyledPaper = styled(Paper)`
    padding: 20px;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    border-radius: 20px !important;
    box-shadow: 0 10px 30px
        rgba(0, 0, 0, 0.08) !important;
`;

const Title = styled.p`
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
`;

const Data = styled(CountUp)`
    font-size: 2rem;
    font-weight: 700;
    color: #16a34a;
`;

export default TeacherHomePage;