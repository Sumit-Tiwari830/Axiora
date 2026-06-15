import React from "react";
import { useDispatch } from "react-redux";
import { Snackbar, Alert, Slide } from "@mui/material";

import { underControl } from "../redux/userRelated/userSlice";
import { underStudentControl } from "../redux/studentRelated/studentSlice";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
}

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
            autoHideDuration={3500}
            onClose={handleClose}
            TransitionComponent={SlideTransition}
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
                    minWidth: 320,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    boxShadow:
                        "0 12px 32px rgba(15, 23, 42, 0.15), 0 2px 6px rgba(15, 23, 42, 0.08)",
                    backdropFilter: "blur(8px)",
                    "& .MuiAlert-icon": {
                        fontSize: "1.35rem",
                        opacity: 1,
                    },
                    "& .MuiAlert-action": {
                        opacity: 0.8,
                        transition: "opacity 0.2s ease",
                        "&:hover": {
                            opacity: 1,
                        },
                    },
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;