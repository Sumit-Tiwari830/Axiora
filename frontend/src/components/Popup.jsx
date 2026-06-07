import React from "react";
import { useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";

import { underControl } from "../redux/userRelated/userSlice";
import { underStudentControl } from "../redux/studentRelated/studentSlice";

const Popup = ({
    message,
    showPopup,
    setShowPopup,
}) => {
    const dispatch = useDispatch();

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;

        setShowPopup(false);

        dispatch(underControl());
        dispatch(underStudentControl());
    };

    const isSuccess =
        message === "Done Successfully" ||
        message === "Success";

    return (
        <Snackbar
            open={showPopup}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Alert
                onClose={handleClose}
                severity={isSuccess ? "success" : "error"}
                variant="filled"
                sx={{
                    width: "100%",
                    minWidth: 300,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;