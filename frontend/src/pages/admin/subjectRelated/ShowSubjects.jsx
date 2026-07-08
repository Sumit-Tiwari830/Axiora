import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';

import { PostAdd as PostAddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import {
    Paper,
    Box,
    IconButton,
    Typography,
    Avatar,
} from '@mui/material';

import TableTemplate from '../../../components/TableTemplate';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import ConfirmModal from '../../../components/ConfirmModal';

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

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({ id: null, address: "" });

    const deleteHandler = (
        deleteID,
        address
    ) => {
        setDeleteInfo({ id: deleteID, address });
        setOpenConfirm(true);
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
            <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
                {/* Page Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 52, height: 52, background: "linear-gradient(135deg, #f59e0b, #ef4444)", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
                            <PostAddIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={800} color="#0f172a">Subjects</Typography>
                            <Typography color="#64748b" fontSize="0.88rem">
                                {subjectRows.length} subject{subjectRows.length !== 1 ? 's' : ''} across all classes
                            </Typography>
                        </Box>
                    </Box>
                    <GreenButton variant="contained" onClick={() => navigate("/Admin/subjects/chooseclass")} sx={{ borderRadius: "12px", px: 3, py: 1.2, fontWeight: 700, textTransform: "none" }}>
                        + Add Subject
                    </GreenButton>
                </Box>

                <Paper
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: "20px",
                        boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
                    }}
                >
                    {subjectRows.length > 0 && (
                        <TableTemplate
                            buttonHaver={SubjectsButtonHaver}
                            columns={subjectColumns}
                            rows={subjectRows}
                        />
                    )}

                    <SpeedDialTemplate actions={actions} />
                </Paper>
            </Box>

            <ConfirmModal
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => {
                    dispatch(deleteUser(deleteInfo.id, deleteInfo.address))
                        .then(() => {
                            dispatch(getSubjectList(currentUser._id, "AllSubjects"));
                        });
                }}
            />
            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </>
    );
};

export default ShowSubjects;