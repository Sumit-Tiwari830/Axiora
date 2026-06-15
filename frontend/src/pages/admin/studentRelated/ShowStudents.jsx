import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton, Typography, Avatar, Chip
} from '@mui/material';
import { PersonRemove as PersonRemoveIcon, PersonAddAlt1 as PersonAddAlt1Icon } from '@mui/icons-material';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popup from '../../../components/Popup';

const ShowStudents = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    const studentRows = studentsList && studentsList.length > 0 && studentsList.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            sclassName: student.sclassName?.sclassName || "Not Assigned",
            id: student._id,
        };
    })

    const StudentButtonHaver = ({ row }) => {
        const options = ['Attendance', 'Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate("/Admin/students/student/attendance/" + row.id)
        }
        const handleMarks = () => {
            navigate("/Admin/students/student/marks/" + row.id)
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => navigate("/Admin/students/student/" + row.id)}>
                    View
                </BlueButton>
                <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <GreenButton onClick={handleClick}>
                            {options[selectedIndex]}
                        </GreenButton>
                        <BlackButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </BlackButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    return (
        <>
            {loading ?
                <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", fontWeight: 600, color: "#64748b" }}>
                    Loading Students...
                </Box>
                :
                <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
                    {/* Page Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ width: 52, height: 52, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 4px 16px rgba(79,70,229,0.3)" }}>
                                <PersonAddAlt1Icon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#0f172a">Students</Typography>
                                <Typography color="#64748b" fontSize="0.88rem">
                                    {Array.isArray(studentsList) ? studentsList.length : 0} student{(Array.isArray(studentsList) ? studentsList.length : 0) !== 1 ? 's' : ''} enrolled
                                </Typography>
                            </Box>
                        </Box>
                        <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")} sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700, textTransform: "none" }}>
                            + Add Student
                        </GreenButton>
                    </Box>

                    {response ? (
                        <Paper sx={{ p: 8, textAlign: "center", borderRadius: "20px", background: "rgba(79,70,229,0.02)", border: "1px dashed rgba(79,70,229,0.2)" }}>
                            <Avatar sx={{ width: 72, height: 72, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", mx: "auto", mb: 2 }}>
                                <PersonAddAlt1Icon sx={{ fontSize: 36 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>No Students Found</Typography>
                            <Typography color="#64748b" mb={3}>Add your first student to get started.</Typography>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")} sx={{ borderRadius: "12px", px: 4, fontWeight: 700, textTransform: "none" }}>
                                Add First Student
                            </GreenButton>
                        </Paper>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: "20px", boxShadow: "0 4px 24px rgba(79,70,229,0.08)" }}>
                            {Array.isArray(studentsList) && studentsList.length > 0 &&
                                <TableTemplate buttonHaver={StudentButtonHaver} columns={studentColumns} rows={studentRows} />
                            }
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    )}
                </Box>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default ShowStudents;