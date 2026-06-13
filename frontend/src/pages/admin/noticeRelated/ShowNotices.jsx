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
        <Paper
            sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: 3,
                p: 2,
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 2 }}
            >
                Notices
            </Typography>

            {noticeRows.length > 0 && (
                <TableTemplate
                    buttonHaver={NoticeButtonHaver}
                    columns={noticeColumns}
                    rows={noticeRows}
                />
            )}

            <SpeedDialTemplate actions={actions} />
        </Paper>
    );
};

export default ShowNotices;