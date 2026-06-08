import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';

import { PostAdd as PostAddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import {
    Paper,
    Box,
    IconButton,
} from '@mui/material';

import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowSubjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        subjectsList,
        loading,
        error,
        response
    } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        dispatch(
            getSubjectList(
                currentUser._id,
                "AllSubjects"
            )
        );
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const deleteHandler = (
        deleteID,
        address
    ) => {
        console.log(deleteID);
        console.log(address);

        setMessage(
            "Sorry the delete function has been disabled for now."
        );

        setShowPopup(true);
    };

    const subjectColumns = [
        {
            id: "subName",
            label: "Subject Name",
            minWidth: 180,
        },
        {
            id: "sessions",
            label: "Sessions",
            minWidth: 120,
        },
        {
            id: "sclassName",
            label: "Class",
            minWidth: 150,
        },
    ];

    const subjectRows =
        subjectsList?.map((subject) => ({
            subName: subject.subName,
            sessions: subject.sessions,
            sclassName:
                subject.sclassName?.sclassName ||
                "Not Assigned",
            sclassID:
                subject.sclassName?._id,
            id: subject._id,
        })) || [];

    const SubjectsButtonHaver = ({
        row,
    }) => {
        return (
            <>
                <IconButton
                    onClick={() =>
                        deleteHandler(
                            row.id,
                            "Subject"
                        )
                    }
                >
                    <DeleteIcon color="error" />
                </IconButton>

                <BlueButton
                    variant="contained"
                    onClick={() =>
                        navigate(
                            `/Admin/subjects/subject/${row.sclassID}/${row.id}`
                        )
                    }
                >
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: (
                <PostAddIcon color="primary" />
            ),
            name: "Add New Subject",
            action: () =>
                navigate(
                    "/Admin/subjects/chooseclass"
                ),
        },
        {
            icon: (
                <DeleteIcon color="error" />
            ),
            name: "Delete All Subjects",
            action: () =>
                deleteHandler(
                    currentUser._id,
                    "Subjects"
                ),
        },
    ];

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
                Loading Subjects...
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
                <h2>No Subjects Found</h2>

                <GreenButton
                    variant="contained"
                    onClick={() =>
                        navigate(
                            "/Admin/subjects/chooseclass"
                        )
                    }
                >
                    Add First Subject
                </GreenButton>
            </Box>
        );
    }

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
                        Subjects
                    </h2>

                    <p
                        style={{
                            marginTop: "8px",
                            color: "#64748b",
                        }}
                    >
                        Manage all subjects and
                        class assignments.
                    </p>
                </Box>

                {subjectRows.length > 0 && (
                    <TableTemplate
                        buttonHaver={
                            SubjectsButtonHaver
                        }
                        columns={subjectColumns}
                        rows={subjectRows}
                    />
                )}

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

export default ShowSubjects;