import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';
import MeetingRoom from '../../pages/MeetingRoom';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
import AccountMenu from '../../components/AccountMenu';
import AddFee from './feeRelated/AddFee';
import ShowFees from './feeRelated/ShowFees';
import ViewFee from './feeRelated/ViewFee';

const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === "/" || path === "/Admin/dashboard") return "Dashboard";
        if (path.startsWith("/Admin/profile")) return "Profile";
        if (path.startsWith("/Admin/complains")) return "Complaints";
        if (path.startsWith("/Admin/fees") || path.startsWith("/Admin/addfee")) return "Fees";
        if (path.startsWith("/Admin/notices") || path.startsWith("/Admin/addnotice")) return "Notices";
        if (path.startsWith("/Admin/subjects") || path.startsWith("/Admin/addsubject")) return "Subjects";
        if (path.startsWith("/Admin/classes") || path.startsWith("/Admin/addclass")) return "Classes";
        if (path.startsWith("/Admin/students") || path.startsWith("/Admin/addstudents")) return "Students";
        if (path.startsWith("/Admin/teachers") || path.startsWith("/Admin/addteacher")) return "Teachers";
        return "Admin";
    };

    if (location.pathname.startsWith("/meeting/")) {
        return (
            <Routes>
                <Route path="/meeting/:roomId" element={<MeetingRoom />} />
            </Routes>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            <AppBar
                open={open}
                position="fixed"
                sx={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: '#0f172a',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                }}
            >
                <Toolbar sx={{ pr: '24px', minHeight: { xs: 64 } }}>
                    <IconButton
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{
                            mr: 3,
                            color: '#4f46e5',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: 'rgba(79, 70, 229, 0.08)',
                                transform: 'scale(1.05)',
                            },
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#64748b',
                            }}
                        >
                            Admin Portal
                        </Typography>
                        <Typography sx={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>/</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#0f172a',
                            }}
                        >
                            {getBreadcrumbs()}
                        </Typography>
                    </Box>

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={open}
                sx={open ? styles.drawerStyled : styles.hideDrawer}
            >
                <Toolbar sx={styles.toolBarStyled}>
                    <IconButton
                        onClick={toggleDrawer}
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                                color: '#ffffff',
                                background: 'rgba(255,255,255,0.1)',
                            },
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                <List component="nav" sx={{ px: 0.5 }}>
                    <SideBar />
                </List>
            </Drawer>

            <Box component="main" sx={styles.boxStyled}>
                <Toolbar />

                <Routes>
                    <Route path="/" element={<AdminHomePage />} />
                    <Route path="*" element={<Navigate to="/" />} />

                    <Route
                        path="/Admin/dashboard"
                        element={<AdminHomePage />}
                    />

                    <Route
                        path="/Admin/profile"
                        element={<AdminProfile />}
                    />

                    <Route
                        path="/Admin/complains"
                        element={<SeeComplains />}
                    />

                    <Route
                        path="/Admin/addfee"
                        element={<AddFee />}
                    />

                    <Route
                        path="/Admin/fees"
                        element={<ShowFees />}
                    />

                    <Route
                        path="/Admin/fees/fee/:id"
                        element={<ViewFee />}
                    />

                    {/* Notice */}
                    <Route
                        path="/Admin/addnotice"
                        element={<AddNotice />}
                    />

                    <Route
                        path="/Admin/notices"
                        element={<ShowNotices />}
                    />

                    {/* Subject */}
                    <Route
                        path="/Admin/subjects"
                        element={<ShowSubjects />}
                    />

                    <Route
                        path="/Admin/subjects/subject/:classID/:subjectID"
                        element={<ViewSubject />}
                    />

                    <Route
                        path="/Admin/subjects/chooseclass"
                        element={<ChooseClass situation="Subject" />}
                    />

                    <Route
                        path="/Admin/addsubject/:id"
                        element={<SubjectForm />}
                    />

                    <Route
                        path="/Admin/class/subject/:classID/:subjectID"
                        element={<ViewSubject />}
                    />

                    <Route
                        path="/Admin/subject/student/attendance/:studentID/:subjectID"
                        element={
                            <StudentAttendance situation="Subject" />
                        }
                    />

                    <Route
                        path="/Admin/subject/student/marks/:studentID/:subjectID"
                        element={
                            <StudentExamMarks situation="Subject" />
                        }
                    />

                    {/* Class */}
                    <Route
                        path="/Admin/addclass"
                        element={<AddClass />}
                    />

                    <Route
                        path="/Admin/classes"
                        element={<ShowClasses />}
                    />

                    <Route
                        path="/Admin/classes/class/:id"
                        element={<ClassDetails />}
                    />

                    <Route
                        path="/Admin/class/addstudents/:id"
                        element={<AddStudent situation="Class" />}
                    />

                    {/* Student */}
                    <Route
                        path="/Admin/addstudents"
                        element={<AddStudent situation="Student" />}
                    />

                    <Route
                        path="/Admin/students"
                        element={<ShowStudents />}
                    />

                    <Route
                        path="/Admin/students/student/:id"
                        element={<ViewStudent />}
                    />

                    <Route
                        path="/Admin/students/student/attendance/:id"
                        element={
                            <StudentAttendance situation="Student" />
                        }
                    />

                    <Route
                        path="/Admin/students/student/marks/:id"
                        element={
                            <StudentExamMarks situation="Student" />
                        }
                    />

                    {/* Teacher */}
                    <Route
                        path="/Admin/teachers"
                        element={<ShowTeachers />}
                    />

                    <Route
                        path="/Admin/teachers/teacher/:id"
                        element={<TeacherDetails />}
                    />

                    <Route
                        path="/Admin/teachers/chooseclass"
                        element={<ChooseClass situation="Teacher" />}
                    />

                    <Route
                        path="/Admin/teachers/choosesubject/:id"
                        element={<ChooseSubject situation="Norm" />}
                    />

                    <Route
                        path="/Admin/teachers/choosesubject/:classID/:teacherID"
                        element={<ChooseSubject situation="Teacher" />}
                    />

                    <Route
                        path="/Admin/teachers/addteacher/:id"
                        element={<AddTeacher />}
                    />

                    <Route
                        path="/logout"
                        element={<Logout />}
                    />
                </Routes>
            </Box>
        </Box>
    );
};

export default AdminDashboard;

const styles = {
    boxStyled: {
        background: '#f8fafc',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        padding: '24px',
        transition: 'all 0.3s ease',
    },

    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 1,
        background: 'transparent',
    },

    drawerStyled: {
        display: 'flex',
    },

    hideDrawer: {
        display: 'flex',
        '@media (max-width: 900px)': {
            display: 'none',
        },
    },
};