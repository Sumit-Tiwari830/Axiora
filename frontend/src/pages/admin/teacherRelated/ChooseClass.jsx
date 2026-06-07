import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";

import {
    PurpleButton,
    BlueButton,
} from "../../../components/buttonStyles";

import TableTemplate from "../../../components/TableTemplate";

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        sclassesList,
        loading,
        error,
        getresponse,
    } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(
                getAllSclasses(currentUser._id, "Sclass")
            );
        }
    }, [dispatch, currentUser]);

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate(`/Admin/teachers/choosesubject/${classID}`);
        } else if (situation === "Subject") {
            navigate(`/Admin/addsubject/${classID}`);
        }
    };

    const sclassColumns = [
        {
            id: "name",
            label: "Class Name",
            minWidth: 250,
        },
    ];

    const sclassRows =
        sclassesList?.map((sclass) => ({
            id: sclass._id,
            name: sclass.sclassName,
        })) || [];

    const SclassButtonHaver = ({ row }) => (
        <PurpleButton
            variant="contained"
            onClick={() => navigateHandler(row.id)}
        >
            Choose
        </PurpleButton>
    );

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
                Something went wrong while loading classes.
            </Typography>
        );
    }

    if (getresponse) {
        return (
            <Paper
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                >
                    No Classes Found
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Please create a class before continuing.
                </Typography>

                <BlueButton
                    variant="contained"
                    onClick={() =>
                        navigate("/Admin/addclass")
                    }
                >
                    Add Class
                </BlueButton>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 4,
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{
                    mb: 3,
                    color: "#2563eb",
                }}
            >
                Choose a Class
            </Typography>

            {sclassRows.length > 0 && (
                <TableTemplate
                    buttonHaver={SclassButtonHaver}
                    columns={sclassColumns}
                    rows={sclassRows}
                />
            )}
        </Paper>
    );
};

export default ChooseClass;