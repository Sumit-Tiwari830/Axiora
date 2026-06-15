import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Button, Collapse, Table, TableBody, TableHead, Typography,
    Paper, Avatar, Chip, Grid, CircularProgress, Divider
} from '@mui/material';
import {
    KeyboardArrowDown, KeyboardArrowUp,
    Person as PersonIcon,
    Class as ClassIcon,
    School as SchoolIcon,
    Assignment as MarksIcon,
    EventAvailable as AttendanceIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import {
    calculateOverallAttendancePercentage,
    calculateSubjectAttendancePercentage,
    groupAttendanceBySubject,
} from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { LightPurpleButton } from '../../components/buttonStyles';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const { currentUser, userDetails, response, loading, error } =
        useSelector((state) => state.user);

    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, 'Student'));
    }, [dispatch, studentID]);

    if (response) console.log(response);
    else if (error) console.log(error);

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage =
        calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage },
    ];

    if (loading) {
        return (
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#4f46e5' }} />
            </Box>
        );
    }

    // Get marks for teacher's subject
    const mySubjectMarks = Array.isArray(subjectMarks)
        ? subjectMarks.filter(
              (r) => r.subName?.subName === teachSubject && r.marksObtained
          )
        : [];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Student Profile Banner */}
            <Paper
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 3,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <Avatar
                        sx={{
                            width: 72, height: 72,
                            fontSize: '1.8rem', fontWeight: 800,
                            background: 'rgba(255,255,255,0.18)',
                            border: '3px solid rgba(255,255,255,0.35)',
                        }}
                    >
                        {userDetails?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Student Profile
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="#fff">
                            {userDetails?.name}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            Roll No. {userDetails?.rollNum} · {sclassName?.sclassName} · {studentSchool?.schoolName}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Info Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Student Name', value: userDetails?.name,             icon: <PersonIcon />,     color: '#4f46e5' },
                    { label: 'Roll Number',  value: userDetails?.rollNum,           icon: <ClassIcon />,      color: '#10b981' },
                    { label: 'Class',        value: sclassName?.sclassName || 'N/A', icon: <ClassIcon />,    color: '#06b6d4' },
                    { label: 'School',       value: studentSchool?.schoolName || '—', icon: <SchoolIcon />,  color: '#f59e0b' },
                ].map((info) => (
                    <Grid item xs={12} sm={6} md={3} key={info.label}>
                        <Paper
                            sx={{
                                p: 2.5, borderRadius: '16px',
                                display: 'flex', alignItems: 'center', gap: 2,
                                border: `1px solid ${info.color}22`,
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${info.color}22` },
                            }}
                        >
                            <Avatar sx={{ width: 40, height: 40, background: `${info.color}18`, color: info.color }}>
                                {info.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="caption" color="#94a3b8" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.68rem' }}>
                                    {info.label}
                                </Typography>
                                <Typography fontWeight={700} color="#0f172a" fontSize="0.95rem">
                                    {info.value}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Attendance Section */}
            <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                            <AttendanceIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#0f172a">Attendance</Typography>
                            <Typography variant="caption" color="#64748b">Subject: {teachSubject}</Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
                        sx={{
                            borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            '&:hover': { background: 'linear-gradient(135deg, #3730a3, #5b21b6)' },
                        }}
                    >
                        Add Attendance
                    </Button>
                </Box>

                {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                    <>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
                            ([subName, { present, allData, subId, sessions }]) => {
                                if (subName !== teachSubject) return null;
                                const pct = calculateSubjectAttendancePercentage(present, sessions);
                                return (
                                    <Box key={subId}>
                                        {/* Attendance Summary */}
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                            {[
                                                { label: 'Present',    value: present,                          color: '#10b981' },
                                                { label: 'Sessions',   value: sessions,                          color: '#4f46e5' },
                                                { label: 'Attendance', value: `${pct}%`,                        color: pct >= 75 ? '#10b981' : '#ef4444' },
                                            ].map((s) => (
                                                <Paper
                                                    key={s.label}
                                                    sx={{ px: 2.5, py: 1.5, borderRadius: '12px', border: `1px solid ${s.color}22`, textAlign: 'center', minWidth: 100 }}
                                                >
                                                    <Typography fontWeight={800} fontSize="1.3rem" color={s.color}>{s.value}</Typography>
                                                    <Typography variant="caption" color="#64748b">{s.label}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>

                                        {/* Progress Bar */}
                                        <Box sx={{ height: 8, background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', mb: 2 }}>
                                            <Box sx={{ height: '100%', width: `${pct}%`, background: pct >= 75 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
                                        </Box>

                                        {/* Detail Toggle */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpen(subId)}
                                            endIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: '#c7d2fe', color: '#4f46e5', mb: 1.5 }}
                                        >
                                            {openStates[subId] ? 'Hide' : 'Show'} Attendance Details
                                        </Button>

                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden', mb: 1 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, i) => {
                                                            const d = new Date(data.date);
                                                            const ds = d.toString() !== 'Invalid Date' ? d.toISOString().substring(0, 10) : 'Invalid Date';
                                                            return (
                                                                <StyledTableRow key={i}>
                                                                    <StyledTableCell>{ds}</StyledTableCell>
                                                                    <StyledTableCell align="right">
                                                                        <Chip
                                                                            label={data.status}
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                background: data.status === 'Present' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                                                color: data.status === 'Present' ? '#10b981' : '#ef4444',
                                                                            }}
                                                                        />
                                                                    </StyledTableCell>
                                                                </StyledTableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </Collapse>
                                    </Box>
                                );
                            }
                        )}

                        {/* Pie Chart */}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={700} color="#64748b" mb={1}>Overall Attendance</Typography>
                        <CustomPieChart data={chartData} />
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="#64748b">No attendance records found for {teachSubject}.</Typography>
                    </Box>
                )}
            </Paper>

            {/* Marks Section */}
            <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            <MarksIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#0f172a">Subject Marks</Typography>
                            <Typography variant="caption" color="#64748b">Subject: {teachSubject}</Typography>
                        </Box>
                    </Box>
                    <LightPurpleButton
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
                        sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none' }}
                    >
                        Add Marks
                    </LightPurpleButton>
                </Box>

                {mySubjectMarks.length > 0 ? (
                    <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Subject</StyledTableCell>
                                    <StyledTableCell align="right">Marks Obtained</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {mySubjectMarks.map((result, i) => (
                                    <StyledTableRow key={i}>
                                        <StyledTableCell>{result.subName?.subName}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <Chip
                                                label={result.marksObtained}
                                                sx={{
                                                    fontWeight: 800,
                                                    background: 'rgba(79,70,229,0.08)',
                                                    color: '#4f46e5',
                                                }}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="#64748b">No marks recorded for {teachSubject} yet.</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default TeacherViewStudent;