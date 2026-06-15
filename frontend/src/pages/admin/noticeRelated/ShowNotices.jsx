import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Paper,
    Box,
    IconButton,
    CircularProgress,
    Typography,
    Button,
} from "@mui/material";

import { NoteAdd as NoteAddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { getAllNotices } from "../../../redux/noticeRelated/noticeHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";

import TableTemplate from "../../../components/TableTemplate";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";

import {
    GreenButton,
} from "../../../components/buttonStyles";

import LinkifyText from "../../../components/LinkifyText";

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        noticesList,
        loading,
        error,
        response,
    } = useSelector((state) => state.notice);

    const { currentUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(
                getAllNotices(currentUser._id, "Notice")
            );
        }
    }, [dispatch, currentUser]);

    const refreshNotices = () => {
        dispatch(
            getAllNotices(currentUser?._id, "Notice")
        );
    };

    const deleteHandler = async (
        deleteID,
        address
    ) => {
        await dispatch(
            deleteUser(deleteID, address)
        );

        refreshNotices();
    };

    const noticeColumns = [
        {
            id: "title",
            label: "Title",
            minWidth: 180,
        },
        {
            id: "details",
            label: "Details",
            minWidth: 250,
        },
        {
            id: "date",
            label: "Date",
            minWidth: 120,
        },
        {
            id: "attachment",
            label: "Attachment",
            minWidth: 150,
        },
    ];

    const noticeRows =
        noticesList?.map((notice) => ({
            title: notice.title,
            details: <LinkifyText text={notice.details} />,
            date: notice.date
                ? new Date(notice.date)
                    .toISOString()
                    .split("T")[0]
                : "N/A",
            id: notice._id,
            attachment: notice.attachment ? (
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        textTransform: "none",
                        borderColor: "#7c3aed",
                        color: "#7c3aed",
                        "&:hover": {
                            borderColor: "#6d28d9",
                            backgroundColor: "rgba(124, 58, 237, 0.04)"
                        }
                    }}
                    onClick={() => {
                        const link = document.createElement("a");
                        link.href = notice.attachment;
                        link.download = notice.attachmentName || "attachment";
                        link.click();
                    }}
                >
                    Download
                </Button>
            ) : "No attachment",
        })) || [];

    const NoticeButtonHaver = ({ row }) => (
        <IconButton
            onClick={() =>
                deleteHandler(row.id, "Notice")
            }
        >
            <DeleteIcon color="error" />
        </IconButton>
    );

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />,
            name: "Add New Notice",
            action: () =>
                navigate("/Admin/addnotice"),
        },
        {
            icon: <DeleteIcon color="error" />,
            name: "Delete All Notices",
            action: () =>
                deleteHandler(
                    currentUser?._id,
                    "Notices"
                ),
        },
    ];

    if (loading) {
        return (
            <Box
                sx={{
                    height: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error">
                Failed to load notices.
            </Typography>
        );
    }

    if (response) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                }}
            >
                <GreenButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/addnotice")
                    }
                >
                    Add Notice
                </GreenButton>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }} className="animate-fadeInUp">
            {/* Page Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                        }}
                    >
                        <NoteAddIcon sx={{ color: "#fff", fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800} color="#0f172a">
                            Notice Board
                        </Typography>
                        <Typography color="#64748b" fontSize="0.88rem">
                            {noticeRows.length} notice{noticeRows.length !== 1 ? "s" : ""} published
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<NoteAddIcon />}
                    onClick={() => navigate("/Admin/addnotice")}
                    sx={{
                        borderRadius: "12px",
                        px: 3,
                        py: 1.2,
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                        "&:hover": { background: "linear-gradient(135deg, #3730a3, #5b21b6)" },
                    }}
                >
                    Add Notice
                </Button>
            </Box>

            {/* Table or Empty */}
            {noticeRows.length > 0 ? (
                <Paper
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: "20px",
                        boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
                    }}
                >
                    <TableTemplate
                        buttonHaver={NoticeButtonHaver}
                        columns={noticeColumns}
                        rows={noticeRows}
                    />
                </Paper>
            ) : (
                <Paper
                    sx={{
                        p: 8,
                        textAlign: "center",
                        borderRadius: "20px",
                        background: "rgba(79,70,229,0.02)",
                        border: "1px dashed rgba(79,70,229,0.2)",
                    }}
                >
                    <Box sx={{ width: 64, height: 64, borderRadius: "18px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                        <NoteAddIcon sx={{ color: "#fff", fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        No Notices Yet
                    </Typography>
                    <Typography color="#64748b" mb={3}>
                        Create your first notice to communicate with students and staff.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<NoteAddIcon />}
                        onClick={() => navigate("/Admin/addnotice")}
                        sx={{
                            borderRadius: "12px",
                            px: 4,
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            fontWeight: 700,
                            textTransform: "none",
                        }}
                    >
                        Add First Notice
                    </Button>
                </Paper>
            )}

            <SpeedDialTemplate actions={actions} />
        </Box>
    );
};

export default ShowNotices;