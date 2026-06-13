import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Paper,
    Typography,
    Box,
    CircularProgress,
    Button,
} from "@mui/material";

import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import TableViewTemplate from "./TableViewTemplate";
import LinkifyText from "./LinkifyText";

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(
        (state) => state.user
    );

    const {
        noticesList,
        loading,
        error,
        response,
    } = useSelector((state) => state.notice);

    useEffect(() => {
        if (!currentUser) return;

        if (currentRole === "Admin") {
            dispatch(
                getAllNotices(currentUser._id, "Notice")
            );
        } else {
            dispatch(
                getAllNotices(
                    currentUser?.school?._id,
                    "Notice"
                )
            );
        }
    }, [dispatch, currentUser, currentRole]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    const noticeColumns = [
        {
            id: "title",
            label: "Title",
            minWidth: 170,
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
        noticesList?.map((notice) => {
            const date = new Date(notice.date);

            return {
                title: notice.title,
                details: <LinkifyText text={notice.details} />,
                date:
                    date.toString() !== "Invalid Date"
                        ? date.toISOString().substring(0, 10)
                        : "Invalid Date",
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
                ) : "-",
            };
        }) || [];

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (response || noticeRows.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    No Notices Available
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography
                variant="h5"
                fontWeight={700}
                mb={3}
            >
                Latest Notices
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <TableViewTemplate
                    columns={noticeColumns}
                    rows={noticeRows}
                />
            </Paper>
        </Box>
    );
};

export default SeeNotice;