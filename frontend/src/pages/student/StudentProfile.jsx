import React from "react";
import {
    Container,
    Paper,
    Typography,
    Avatar,
    Box,
    Grid,
    Divider,
} from "@mui/material";
import { useSelector } from "react-redux";

const StudentProfile = () => {
    const {
        currentUser,
        response,
        error,
    } = useSelector((state) => state.user);

    if (response) console.log(response);
    if (error) console.log(error);

    return (
        <Container maxWidth="md">
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: "24px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mb={4}
                >
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: "3rem",
                            mb: 2,
                            bgcolor: "#2563eb",
                        }}
                    >
                        {currentUser?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {currentUser?.name}
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Student Profile
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Roll Number
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.rollNum ||
                                "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Class
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.sclassName
                                ?.sclassName ||
                                "Not Assigned"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            School
                        </Typography>

                        <Typography variant="h6">
                            {currentUser?.school
                                ?.schoolName ||
                                "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Role
                        </Typography>

                        <Typography variant="h6">
                            Student
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default StudentProfile;