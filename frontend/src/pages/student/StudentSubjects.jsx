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
} from "@mui/material";

import CustomBarChart from "../../components/CustomBarChart";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

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
        <Box
            sx={{
                p: 4,
                background: "#fff",
                borderRadius: "20px",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
            }}
        >
            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Class Details
            </Typography>

            <Typography mb={2}>
                <strong>Class:</strong>{" "}
                {
                    currentUser?.sclassName
                        ?.sclassName
                }
            </Typography>

            <Typography
                variant="h6"
                mb={2}
            >
                Subjects
            </Typography>

            {subjectsList?.map(
                (subject) => (
                    <Typography
                        key={subject._id}
                        sx={{ mb: 1 }}
                    >
                        • {subject.subName} (
                        {subject.subCode})
                    </Typography>
                )
            )}
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