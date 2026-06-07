import React, { useEffect, useState } from "react";
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";

import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableHead,
    Typography,
    Container,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { getUserDetails } from "../../redux/userRelated/userHandle";

import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject,
} from "../../components/attendanceCalculator";

import CustomBarChart from "../../components/CustomBarChart";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

import {
    StyledTableCell,
    StyledTableRow,
} from "../../components/styles";

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const {
        userDetails,
        currentUser,
        loading,
        response,
        error,
    } = useSelector((state) => state.user);

    const [openStates, setOpenStates] = useState({});
    const [subjectAttendance, setSubjectAttendance] =
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
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(
                userDetails.attendance || []
            );
        }
    }, [userDetails]);

    if (response) console.log(response);
    if (error) console.log(error);

    const handleOpen = (subId) => {
        setOpenStates((prev) => ({
            ...prev,
            [subId]: !prev[subId],
        }));
    };

    const handleSectionChange = (
        event,
        newSection
    ) => {
        setSelectedSection(newSection);
    };

    const attendanceBySubject =
        groupAttendanceBySubject(
            subjectAttendance
        );

    const overallAttendancePercentage =
        calculateOverallAttendancePercentage(
            subjectAttendance
        );

    const subjectData = Object.entries(
        attendanceBySubject
    ).map(
        ([
            subName,
            {
                present,
                sessions,
            },
        ]) => ({
            subject: subName,
            attendancePercentage:
                calculateSubjectAttendancePercentage(
                    present,
                    sessions
                ),
            totalClasses: sessions,
            attendedClasses: present,
        })
    );

    const renderTableSection = () => (
        <>
            <Box
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "20px",
                    background: "#fff",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={2}
                >
                    Attendance Overview
                </Typography>

                <Typography
                    variant="h6"
                    color="primary"
                >
                    Overall Attendance:{" "}
                    {overallAttendancePercentage.toFixed(
                        2
                    )}
                    %
                </Typography>
            </Box>

            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>
                            Subject
                        </StyledTableCell>

                        <StyledTableCell>
                            Present
                        </StyledTableCell>

                        <StyledTableCell>
                            Total Sessions
                        </StyledTableCell>

                        <StyledTableCell>
                            Attendance %
                        </StyledTableCell>

                        <StyledTableCell align="center">
                            Actions
                        </StyledTableCell>
                    </StyledTableRow>
                </TableHead>

                {Object.entries(
                    attendanceBySubject
                ).map(
                    ([
                        subName,
                        {
                            present,
                            allData,
                            subId,
                            sessions,
                        },
                    ]) => {
                        const percentage =
                            calculateSubjectAttendancePercentage(
                                present,
                                sessions
                            );

                        return (
                            <TableBody
                                key={subId}
                            >
                                <StyledTableRow>
                                    <StyledTableCell>
                                        {
                                            subName
                                        }
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {
                                            present
                                        }
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {
                                            sessions
                                        }
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {
                                            percentage
                                        }
                                        %
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleOpen(
                                                    subId
                                                )
                                            }
                                        >
                                            {openStates[
                                                subId
                                            ] ? (
                                                <KeyboardArrowUp />
                                            ) : (
                                                <KeyboardArrowDown />
                                            )}

                                            Details
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>

                                <StyledTableRow>
                                    <StyledTableCell
                                        colSpan={
                                            6
                                        }
                                        sx={{
                                            py: 0,
                                        }}
                                    >
                                        <Collapse
                                            in={
                                                openStates[
                                                subId
                                                ]
                                            }
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box
                                                sx={{
                                                    m: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                >
                                                    Attendance
                                                    Records
                                                </Typography>

                                                <Table size="small">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>
                                                                Date
                                                            </StyledTableCell>

                                                            <StyledTableCell align="right">
                                                                Status
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {allData?.map(
                                                            (
                                                                item,
                                                                idx
                                                            ) => {
                                                                const date =
                                                                    new Date(
                                                                        item.date
                                                                    );

                                                                const dateString =
                                                                    !isNaN(
                                                                        date
                                                                    )
                                                                        ? date
                                                                            .toISOString()
                                                                            .split(
                                                                                "T"
                                                                            )[0]
                                                                        : "-";

                                                                return (
                                                                    <StyledTableRow
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <StyledTableCell>
                                                                            {
                                                                                dateString
                                                                            }
                                                                        </StyledTableCell>

                                                                        <StyledTableCell align="right">
                                                                            {
                                                                                item.status
                                                                            }
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                                                );
                                                            }
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        );
                    }
                )}
            </Table>
        </>
    );

    const renderChartSection = () => (
        <CustomBarChart
            chartData={subjectData}
            dataKey="attendancePercentage"
        />
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
                Loading Attendance...
            </Box>
        );
    }

    return (
        <>
            {subjectAttendance?.length >
                0 ? (
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
                <Box
                    sx={{
                        textAlign: "center",
                        py: 8,
                    }}
                >
                    <Typography variant="h5">
                        No Attendance Records
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        Attendance will appear
                        here once marked by
                        your teacher.
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default ViewStdAttendance;