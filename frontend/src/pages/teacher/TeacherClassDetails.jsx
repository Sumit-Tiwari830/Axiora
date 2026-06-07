import { useEffect } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";

import {
    Paper,
    Box,
    Typography,
    ButtonGroup,
    Button,
    Popper,
    Grow,
    ClickAwayListener,
    MenuList,
    MenuItem,
} from "@mui/material";

import {
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";

import {
    BlackButton,
    BlueButton,
} from "../../components/buttonStyles";

import TableTemplate from "../../components/TableTemplate";

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        sclassStudents,
        loading,
        error,
        getresponse,
    } = useSelector(
        (state) => state.sclass
    );

    const { currentUser } = useSelector(
        (state) => state.user
    );

    const classID =
        currentUser?.teachSclass?._id;

    const subjectID =
        currentUser?.teachSubject?._id;

    useEffect(() => {
        if (classID) {
            dispatch(
                getClassStudents(classID)
            );
        }
    }, [dispatch, classID]);

    if (error) {
        console.log(error);
    }

    const studentColumns = [
        {
            id: "name",
            label: "Name",
            minWidth: 180,
        },
        {
            id: "rollNum",
            label: "Roll Number",
            minWidth: 120,
        },
    ];

    const studentRows =
        sclassStudents?.map(
            (student) => ({
                name: student.name,
                rollNum:
                    student.rollNum,
                id: student._id,
            })
        ) || [];

    const StudentsButtonHaver = ({
        row,
    }) => {
        const options = [
            "Take Attendance",
            "Provide Marks",
        ];

        const [open, setOpen] =
            React.useState(false);

        const [selectedIndex, setSelectedIndex] =
            React.useState(0);

        const anchorRef =
            React.useRef(null);

        const handleAttendance =
            () => {
                navigate(
                    `/Teacher/class/student/attendance/${row.id}/${subjectID}`
                );
            };

        const handleMarks = () => {
            navigate(
                `/Teacher/class/student/marks/${row.id}/${subjectID}`
            );
        };

        const handleClick = () => {
            if (
                selectedIndex === 0
            ) {
                handleAttendance();
            } else {
                handleMarks();
            }
        };

        const handleMenuItemClick =
            (event, index) => {
                setSelectedIndex(
                    index
                );
                setOpen(false);
            };

        const handleToggle =
            () => {
                setOpen(
                    (prevOpen) =>
                        !prevOpen
                );
            };

        const handleClose = (
            event
        ) => {
            if (
                anchorRef.current &&
                anchorRef.current.contains(
                    event.target
                )
            ) {
                return;
            }

            setOpen(false);
        };

        return (
            <>
                <BlueButton
                    variant="contained"
                    sx={{
                        mr: 1,
                        borderRadius:
                            "10px",
                    }}
                    onClick={() =>
                        navigate(
                            "/Teacher/class/student/" +
                            row.id
                        )
                    }
                >
                    View
                </BlueButton>

                <ButtonGroup
                    variant="contained"
                    ref={anchorRef}
                >
                    <Button
                        onClick={
                            handleClick
                        }
                    >
                        {
                            options[
                            selectedIndex
                            ]
                        }
                    </Button>

                    <BlackButton
                        size="small"
                        onClick={
                            handleToggle
                        }
                    >
                        {open ? (
                            <KeyboardArrowUp />
                        ) : (
                            <KeyboardArrowDown />
                        )}
                    </BlackButton>
                </ButtonGroup>

                <Popper
                    open={open}
                    anchorEl={
                        anchorRef.current
                    }
                    transition
                    disablePortal
                    sx={{
                        zIndex: 10,
                    }}
                >
                    {({
                        TransitionProps,
                        placement,
                    }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement ===
                                        "bottom"
                                        ? "center top"
                                        : "center bottom",
                            }}
                        >
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={
                                        handleClose
                                    }
                                >
                                    <MenuList>
                                        {options.map(
                                            (
                                                option,
                                                index
                                            ) => (
                                                <MenuItem
                                                    key={
                                                        option
                                                    }
                                                    selected={
                                                        index ===
                                                        selectedIndex
                                                    }
                                                    onClick={(
                                                        event
                                                    ) =>
                                                        handleMenuItemClick(
                                                            event,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {
                                                        option
                                                    }
                                                </MenuItem>
                                            )
                                        )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </>
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    fontSize:
                        "1.2rem",
                    fontWeight: 600,
                    color:
                        "#64748b",
                }}
            >
                Loading Students...
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Class Details
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    Manage students,
                    attendance and
                    marks.
                </Typography>
            </Box>

            {getresponse ? (
                <Paper
                    sx={{
                        p: 5,
                        textAlign:
                            "center",
                        borderRadius:
                            "20px",
                    }}
                >
                    <Typography
                        variant="h6"
                    >
                        No Students Found
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    sx={{
                        width: "100%",
                        overflow:
                            "hidden",
                        borderRadius:
                            "20px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                >
                    <Box
                        sx={{
                            p: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Students List
                        </Typography>
                    </Box>

                    {studentRows.length >
                        0 && (
                            <TableTemplate
                                buttonHaver={
                                    StudentsButtonHaver
                                }
                                columns={
                                    studentColumns
                                }
                                rows={
                                    studentRows
                                }
                            />
                        )}
                </Paper>
            )}
        </>
    );
};

export default TeacherClassDetails;