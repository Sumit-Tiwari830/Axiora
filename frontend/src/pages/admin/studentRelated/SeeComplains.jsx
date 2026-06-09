import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Box,
    Checkbox,
    IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';

const SeeComplains = () => {
    const dispatch = useDispatch();

    const { complainsList, loading, error, response } =
        useSelector((state) => state.complain);

    const { currentUser } =
        useSelector((state) => state.user);

    const label = {
        inputProps: {
            'aria-label': 'Checkbox demo',
        },
    };

    useEffect(() => {
        dispatch(
            getAllComplains(
                currentUser._id,
                "Complain"
            )
        );
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllComplains(currentUser._id, "Complain"));
            })
    }

    const complainColumns = [
        {
            id: 'user',
            label: 'User',
            minWidth: 170,
        },
        {
            id: 'complaint',
            label: 'Complaint',
            minWidth: 250,
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 170,
        },
    ];

    const complainRows =
        complainsList &&
        complainsList.length > 0 &&
        complainsList.map((complain) => {
            const date = new Date(
                complain.date
            );

            const dateString =
                date.toString() !== "Invalid Date"
                    ? date
                        .toISOString()
                        .substring(0, 10)
                    : "Invalid Date";

            return {
                user:
                    complain.user?.name ||
                    "Unknown User",
                complaint:
                    complain.complaint,
                date: dateString,
                id: complain._id,
            };
        });

    const ComplainButtonHaver = ({ row }) => {
        return (
            <>
                <Checkbox {...label} />
                <IconButton onClick={() => deleteHandler(row.id, "Complain")}>
                    <DeleteIcon color="error" />
                </IconButton>
            </>
        );
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
                Loading Complaints...
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
                <h2>No Complaints Found</h2>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    There are currently no
                    complaints submitted.
                </p>
            </Box>
        );
    }

    return (
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
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        color: "#0f172a",
                        fontWeight: 700,
                    }}
                >
                    Student Complaints
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#64748b",
                    }}
                >
                    Review complaints submitted
                    by students.
                </p>
            </Box>

            {Array.isArray(
                complainsList
            ) &&
                complainsList.length > 0 && (
                    <TableTemplate
                        buttonHaver={
                            ComplainButtonHaver
                        }
                        columns={
                            complainColumns
                        }
                        rows={complainRows}
                    />
                )}
        </Paper>
    );
};

export default SeeComplains;