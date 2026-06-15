import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import { getUserDetails } from "../../redux/userRelated/userHandle";

import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Paper,
    Table,
    TableBody,
    TableHead,
    Typography,
    Box,
    Avatar,
    Chip,
} from "@mui/material";

import CustomBarChart from "../../components/CustomBarChart";

import {
    InsertChart as InsertChartIcon,
    InsertChartOutlined as InsertChartOutlinedIcon,
    TableChart as TableChartIcon,
    TableChartOutlined as TableChartOutlinedIcon,
    MenuBook as SubjectIcon,
    Class as ClassIcon,
    BarChart as BarChartIcon,
} from '@mui/icons-material';

import {
    StyledTableCell,
    StyledTableRow,
} from "../../components/styles";

const StudentSubjects = () => {
    const dispatch = useDispatch();

    const { subjectsList } = useSelector(
        (state) => state.sclass
    );

    const {
        userDetails,
        currentUser,
        loading,
        response,
        error,
    } = useSelector((state) => state.user);

    const [subjectMarks, setSubjectMarks] =
        useState([]);

    const [selectedSection, setSelectedSection] =
        useState("table");

    useEffect(() => {
        dispatch(
            getUserDetails(
                currentUser._id,
                "Student"
            )
        );

        dispatch(
            getSubjectList(
                currentUser.sclassName._id,
                "ClassSubjects"
            )
        );
    }, [
        dispatch,
        currentUser._id,
        currentUser.sclassName._id,
    ]);

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(
                userDetails.examResult || []
            );
        }
    }, [userDetails]);

    if (response) console.log(response);
    if (error) console.log(error);

    const handleSectionChange = (
        event,
        newSection
    ) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <>
            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Subject Marks
            </Typography>

            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>
                            Subject
                        </StyledTableCell>

                        <StyledTableCell>
                            Marks
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>

                <TableBody>
                    {subjectMarks.map(
                        (result, index) => (
                            <StyledTableRow
                                key={index}
                            >
                                <StyledTableCell>
                                    {
                                        result
                                            ?.subName
                                            ?.subName
                                    }
                                </StyledTableCell>

                                <StyledTableCell>
                                    {
                                        result?.marksObtained
                                    }
                                </StyledTableCell>
                            </StyledTableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </>
    );

    const renderChartSection = () => (
        <CustomBarChart
            chartData={subjectMarks}
            dataKey="marksObtained"
        />
    );

    const renderClassDetailsSection = () => (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Header Banner */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Avatar sx={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
                        <SubjectIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", display: "block" }}>Student Portal</Typography>
                        <Typography variant="h4" fontWeight={800} color="#fff">My Subjects</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                            Class: {currentUser?.sclassName?.sclassName}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Subject Cards */}
            <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: "0 4px 24px rgba(79,70,229,0.08)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <Avatar sx={{ width: 40, height: 40, background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                        <ClassIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} color="#0f172a">
                        Enrolled Subjects
                    </Typography>
                    <Chip
                        label={`${subjectsList?.length || 0} subjects`}
                        size="small"
                        sx={{ background: "rgba(79,70,229,0.08)", color: "#4f46e5", fontWeight: 600 }}
                    />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
                    {subjectsList?.map((subject, index) => {
                        const gradients = [
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            "linear-gradient(135deg, #06b6d4, #3b82f6)",
                            "linear-gradient(135deg, #10b981, #059669)",
                            "linear-gradient(135deg, #f59e0b, #ef4444)",
                            "linear-gradient(135deg, #ec4899, #be185d)",
                        ];
                        return (
                            <Box
                                key={subject._id}
                                sx={{
                                    p: 2.5,
                                    borderRadius: "16px",
                                    border: "1px solid #e2e8f0",
                                    transition: "all 0.3s ease",
                                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(79,70,229,0.12)", borderColor: "#c7d2fe" },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        background: gradients[index % gradients.length],
                                        mb: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {subject.subName?.charAt(0)}
                                </Avatar>
                                <Typography fontWeight={700} color="#0f172a" fontSize="0.95rem">
                                    {subject.subName}
                                </Typography>
                                <Typography variant="caption" color="#64748b" fontWeight={500}>
                                    Code: {subject.subCode}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                {(!subjectsList || subjectsList.length === 0) && (
                    <Typography color="#64748b" textAlign="center" py={4}>
                        No subjects assigned to your class yet.
                    </Typography>
                )}
            </Paper>
        </Box>
    );

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent:
                        "center",
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

    return (
        <>
            {subjectMarks.length > 0 ? (
                <>
                    <Container>
                        {selectedSection ===
                            "table" &&
                            renderTableSection()}

                        {selectedSection ===
                            "chart" &&
                            renderChartSection()}
                    </Container>

                    <Paper
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                        elevation={3}
                    >
                        <BottomNavigation
                            value={
                                selectedSection
                            }
                            onChange={
                                handleSectionChange
                            }
                            showLabels
                        >
                            <BottomNavigationAction
                                label="Table"
                                value="table"
                                icon={
                                    selectedSection ===
                                        "table" ? (
                                        <TableChartIcon />
                                    ) : (
                                        <TableChartOutlinedIcon />
                                    )
                                }
                            />

                            <BottomNavigationAction
                                label="Chart"
                                value="chart"
                                icon={
                                    selectedSection ===
                                        "chart" ? (
                                        <InsertChartIcon />
                                    ) : (
                                        <InsertChartOutlinedIcon />
                                    )
                                }
                            />
                        </BottomNavigation>
                    </Paper>
                </>
            ) : (
                renderClassDetailsSection()
            )}
        </>
    );
};

export default StudentSubjects;