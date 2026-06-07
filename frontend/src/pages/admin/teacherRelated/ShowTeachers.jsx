import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { teachersList, loading, error, response } = useSelector(
        (state) => state.teacher
    );

    const { currentUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);

        setMessage(
            "Sorry the delete function has been disabled for now."
        );

        setShowPopup(true);
    };

    if (loading) {
        return (
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
                Loading Teachers...
            </Box>
        );
    }

    if (response) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: 8,
                }}
            >
                <h2>No Teachers Found</h2>

                <GreenButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/teachers/chooseclass")
                    }
                >
                    Add First Teacher
                </GreenButton>
            </Box>
        );
    }

    if (error) {
        console.log(error);
    }

    const columns = [
        {
            id: "name",
            label: "Name",
            minWidth: 170,
        },
        {
            id: "teachSubject",
            label: "Subject",
            minWidth: 120,
        },
        {
            id: "teachSclass",
            label: "Class",
            minWidth: 120,
        },
    ];

    const rows =
        teachersList?.map((teacher) => ({
            name: teacher.name,
            teachSubject:
                teacher.teachSubject?.subName || null,
            teachSclass:
                teacher.teachSclass?.sclassName ||
                "Not Assigned",
            teachSclassID:
                teacher.teachSclass?._id,
            id: teacher._id,
        })) || [];

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />,
            name: "Add New Teacher",
            action: () =>
                navigate(
                    "/Admin/teachers/chooseclass"
                ),
        },
        {
            icon: <PersonRemoveIcon color="error" />,
            name: "Delete All Teachers",
            action: () =>
                deleteHandler(
                    currentUser._id,
                    "Teachers"
                ),
        },
    ];

    return (
        <>
            <Paper
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        borderBottom:
                            "1px solid #e2e8f0",
                        background: "#fff",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            color: "#0f172a",
                            fontWeight: 700,
                        }}
                    >
                        Teachers
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#64748b",
                        }}
                    >
                        Manage teachers, subjects and
                        class assignments.
                    </p>
                </Box>

                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <StyledTableRow>
                                {columns.map(
                                    (column) => (
                                        <StyledTableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth:
                                                    column.minWidth,
                                            }}
                                        >
                                            {column.label}
                                        </StyledTableCell>
                                    )
                                )}

                                <StyledTableCell align="center">
                                    Actions
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableHead>

                        <TableBody>
                            {rows
                                ?.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage +
                                    rowsPerPage
                                )
                                .map((row) => (
                                    <StyledTableRow
                                        hover
                                        key={row.id}
                                    >
                                        {columns.map(
                                            (column) => {
                                                const value =
                                                    row[column.id];

                                                if (
                                                    column.id ===
                                                    "teachSubject"
                                                ) {
                                                    return (
                                                        <StyledTableCell
                                                            key={column.id}
                                                        >
                                                            {value ? (
                                                                value
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    sx={{
                                                                        borderRadius:
                                                                            "10px",
                                                                        textTransform:
                                                                            "none",
                                                                    }}
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`
                                                                        )
                                                                    }
                                                                >
                                                                    Add
                                                                    Subject
                                                                </Button>
                                                            )}
                                                        </StyledTableCell>
                                                    );
                                                }

                                                return (
                                                    <StyledTableCell
                                                        key={column.id}
                                                    >
                                                        {value}
                                                    </StyledTableCell>
                                                );
                                            }
                                        )}

                                        <StyledTableCell align="center">
                                            <IconButton
                                                onClick={() =>
                                                    deleteHandler(
                                                        row.id,
                                                        "Teacher"
                                                    )
                                                }
                                            >
                                                <PersonRemoveIcon color="error" />
                                            </IconButton>

                                            <BlueButton
                                                variant="contained"
                                                sx={{
                                                    borderRadius:
                                                        "10px",
                                                    ml: 1,
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        "/Admin/teachers/teacher/" +
                                                        row.id
                                                    )
                                                }
                                            >
                                                View
                                            </BlueButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        100,
                    ]}
                    component="div"
                    count={rows?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(
                        event,
                        newPage
                    ) =>
                        setPage(newPage)
                    }
                    onRowsPerPageChange={(
                        event
                    ) => {
                        setRowsPerPage(
                            parseInt(
                                event.target.value,
                                10
                            )
                        );
                        setPage(0);
                    }}
                />

                <SpeedDialTemplate
                    actions={actions}
                />
            </Paper>

            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </>
    );
};

export default ShowTeachers;