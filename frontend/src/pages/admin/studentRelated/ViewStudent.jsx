import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Avatar } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';

import { InsertChart as InsertChartIcon, InsertChartOutlined as InsertChartOutlinedIcon, TableChart as TableChartIcon, TableChartOutlined as TableChartOutlinedIcon } from '@mui/icons-material';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [sclassName, setSclassName] = useState({});
    const [studentSchool, setStudentSchool] = useState({});
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || {});
            setStudentSchool(userDetails.school || {});
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const deleteHandler = () => {
        setMessage("Delete feature will be available soon.");
        setShowPopup(true);
    };

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            });
    };

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Attendance:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Present</StyledTableCell>
                                <StyledTableCell>Total Sessions</StyledTableCell>
                                <StyledTableCell>Attendance Percentage</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                <TableBody key={index}>
                                    <StyledTableRow>
                                        <StyledTableCell>{subName}</StyledTableCell>
                                        <StyledTableCell>{present}</StyledTableCell>
                                        <StyledTableCell>{sessions}</StyledTableCell>
                                        <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button variant="contained"
                                                onClick={() => handleOpen(subId)}>
                                                {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                            </Button>
                                            <IconButton onClick={() => removeSubAttendance(subId)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <Button variant="contained" sx={styles.attendanceButton}
                                                onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}>
                                                Change
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Attendance Details
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <StyledTableRow>
                                                                <StyledTableCell>Date</StyledTableCell>
                                                                <StyledTableCell align="right">Status</StyledTableCell>
                                                            </StyledTableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <StyledTableRow key={index}>
                                                                        <StyledTableCell component="th" scope="row">
                                                                            {dateString}
                                                                        </StyledTableCell>
                                                                        <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                    </StyledTableRow>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            )
                        })}
                    </Table>
                    <div>
                        Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                    </div>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => removeHandler(studentID, "RemoveStudentAtten")}>Delete All</Button>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                </>
            )
        }
        return (
            <>
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}>
                        Add Attendance
                    </Button>
                }
            </>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <>
                    <h3>Subject Marks:</h3>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Subject</StyledTableCell>
                                <StyledTableCell>Marks</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                        <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                </>
            )
        }
        const renderChartSection = () => {
            return (
                <>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                </>
            )
        }
        return (
            <>
                {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0
                    ?
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                            <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                                <BottomNavigationAction
                                    label="Table"
                                    value="table"
                                    icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                                />
                                <BottomNavigationAction
                                    label="Chart"
                                    value="chart"
                                    icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                                />
                            </BottomNavigation>
                        </Paper>
                    </>
                    :
                    <Button variant="contained" sx={styles.styledButton} onClick={() => navigate("/Admin/students/student/marks/" + studentID)}>
                        Add Marks
                    </Button>
                }
            </>
        )
    }

    const StudentDetailsSection = () => {
        const initial = userDetails?.name?.charAt(0)?.toUpperCase() || 'S';
        const gradients = [
            "linear-gradient(135deg, #4f46e5, #7c3aed)",
            "linear-gradient(135deg, #10b981, #059669)",
            "linear-gradient(135deg, #06b6d4, #3b82f6)",
        ];
        const gradient = gradients[(userDetails?.rollNum || 0) % gradients.length];

        const infoRows = [
            { label: 'Name',        value: userDetails?.name,                  color: '#4f46e5' },
            { label: 'Roll Number', value: userDetails?.rollNum,               color: '#10b981' },
            { label: 'Class',       value: sclassName?.sclassName || 'N/A',    color: '#06b6d4' },
            { label: 'School',      value: studentSchool?.schoolName || '—',    color: '#f59e0b' },
        ];

        return (
            <Box>
                {/* Profile Hero */}
                <Paper
                    sx={{
                        p: { xs: 3, md: 4 },
                        mb: 3,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        flexWrap: 'wrap',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    <Avatar
                        sx={{
                            width: 80, height: 80,
                            fontSize: '2rem', fontWeight: 800,
                            background: 'rgba(255,255,255,0.18)',
                            border: '3px solid rgba(255,255,255,0.35)',
                            flexShrink: 0,
                        }}
                    >
                        {initial}
                    </Avatar>
                    <Box sx={{ zIndex: 1 }}>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)' }}>Student Profile</Typography>
                        <Typography variant="h4" fontWeight={800} color="#fff">{userDetails?.name}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Roll No. {userDetails?.rollNum} · {sclassName?.sclassName}
                        </Typography>
                    </Box>
                </Paper>

                {/* Info Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
                    {infoRows.map((row) => (
                        <Paper
                            key={row.label}
                            sx={{
                                p: 2.5, borderRadius: '16px',
                                display: 'flex', alignItems: 'center', gap: 2,
                                border: `1px solid ${row.color}22`,
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${row.color}22` },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: row.color, flexShrink: 0,
                                }}
                            />
                            <Box>
                                <Typography variant="caption" color="#94a3b8" fontWeight={600} sx={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    {row.label}
                                </Typography>
                                <Typography fontWeight={700} color="#0f172a" fontSize="1rem">
                                    {row.value}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Attendance Chart */}
                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                    <Paper sx={{ p: 3, borderRadius: '20px', mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} color="#0f172a" mb={2}>Overall Attendance</Typography>
                        <CustomPieChart data={chartData} />
                    </Paper>
                )}

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteHandler}
                    sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 700, textTransform: 'none' }}
                >
                    Delete Student
                </Button>
            </Box>
        );
    };

    return (
        <>
            {loading
                ?
                <Box
                    sx={{
                        height: "70vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "#64748b",
                    }}
                >
                    Loading Student Details...
                </Box>
                :
                <>
                    <Box sx={{ width: '100%', typography: 'body1', }} >
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList
                                    onChange={handleChange}
                                    sx={{
                                        bgcolor: "#fff",
                                        borderRadius: "12px",
                                        mb: 3,
                                    }}
                                >
                                    <Tab label="Details" value="1" />
                                    <Tab label="Attendance" value="2" />
                                    <Tab label="Marks" value="3" />
                                </TabList>
                            </Box>
                            <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                                <TabPanel value="1">
                                    <StudentDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <StudentAttendanceSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <StudentMarksSection />
                                </TabPanel>
                            </Container>
                        </TabContext>
                    </Box>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

        </>
    )
}

export default ViewStudent;

const styles = {
    attendanceButton: {
        marginLeft: "20px",
        backgroundColor: "#270843",
        "&:hover": {
            backgroundColor: "#3f1068",
        }
    },
    styledButton: {
        marginTop: "20px",
        backgroundColor: "#02250b",
        "&:hover": {
            backgroundColor: "#106312",
        }
    }
}