import React from "react";
import {
    Avatar,
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
} from "@mui/material";

import { useSelector } from "react-redux";

const TeacherProfile = () => {
    const { currentUser, response, error } = useSelector(
        (state) => state.user
    );

    if (response) console.log(response);
    if (error) console.log(error);

    const teachSclass = currentUser?.teachSclass;
    const teachSubject = currentUser?.teachSubject;
    const teachSchool = currentUser?.school;

    return (
        <Container maxWidth="md">
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    background: "#fff",
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            justifyContent="center"
                        >
                            <Avatar
                                sx={{
                                    width: 140,
                                    height: 140,
                                    fontSize: "3rem",
                                    bgcolor: "#2563eb",
                                }}
                            >
                                {currentUser?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </Avatar>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight={700}
                        >
                            {currentUser?.name}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            align="center"
                            color="text.secondary"
                        >
                            Teacher
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Card
                sx={{
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Professional Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Name:</strong>{" "}
                                {currentUser?.name}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Email:</strong>{" "}
                                {currentUser?.email}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Class:</strong>{" "}
                                {teachSclass?.sclassName ||
                                    "Not Assigned"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography>
                                <strong>Subject:</strong>{" "}
                                {teachSubject?.subName ||
                                    "Not Assigned"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography>
                                <strong>School:</strong>{" "}
                                {teachSchool?.schoolName ||
                                    "-"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default TeacherProfile;