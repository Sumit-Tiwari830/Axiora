import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormGroup,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Chip
} from "@mui/material";
import { 
    VideoCall as VideoCallIcon, 
    Autorenew as AutorenewIcon,
    ContentCopy as ContentCopyIcon,
    Groups as GroupsIcon,
    Lock as LockIcon
} from "@mui/icons-material";
import { io } from "socket.io-client";

import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { addStuff } from "../../redux/userRelated/userHandle";
import { underControl } from "../../redux/userRelated/userSlice";
import Popup from "../../components/Popup";

const TeacherMeeting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { sclassStudents, loading } = useSelector((state) => state.sclass);
    const { status, response } = useSelector((state) => state.user);

    const [meetingCode, setMeetingCode] = useState("");
    const [password, setPassword] = useState("");
    const [inviteType, setInviteType] = useState("all"); // "all" or "manual"
    const [selectedStudents, setSelectedStudents] = useState([]);
    
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const classID = currentUser?.teachSclass?._id;
    const className = currentUser?.teachSclass?.sclassName || "Class";
    const subjectName = currentUser?.teachSubject?.subName || "Live Class";

    // Generate random meeting code (e.g. abc-defg-hij)
    const generateMeetingCode = () => {
        const p1 = Math.random().toString(36).substring(2, 5);
        const p2 = Math.random().toString(36).substring(2, 6);
        const p3 = Math.random().toString(36).substring(2, 5);
        return `${p1}-${p2}-${p3}`;
    };

    // Generate random password
    const generatePassword = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    useEffect(() => {
        setMeetingCode(generateMeetingCode());
        setPassword(generatePassword());
        if (classID) {
            dispatch(getClassStudents(classID));
        }
    }, [dispatch, classID]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedStudents(sclassStudents.map(s => s._id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoader(true);

        const invitees = inviteType === "all" ? [] : selectedStudents;
        if (inviteType === "manual" && invitees.length === 0) {
            setMessage("Please select at least one student to invite.");
            setShowPopup(true);
            setLoader(false);
            return;
        }

        const meetingUrl = `/meeting/${meetingCode}`;

        // 1. Create a database Notice for persistence
        const noticeDetails = `Live Class Meeting: ${subjectName} is live. Join Link: ${window.location.origin}${meetingUrl} | Meeting Code: ${meetingCode} | Password: ${password}`;
        const fields = {
            title: `🔴 Live Class: ${subjectName}`,
            details: noticeDetails,
            date: new Date().toISOString(),
            adminID: currentUser.school?._id || currentUser.school,
            isGlobal: false,
            targetClasses: [classID]
        };

        dispatch(addStuff(fields, "Notice"));

        // 2. Emit Real-time Socket Notification
        try {
            const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/api";
            const socketUrl = baseUrl.replace("/api", "").replace(/\/$/, "");
            const socket = io(socketUrl, { transports: ["websocket", "polling"] });
            socket.emit("send-meeting-invite", {
                targetStudentIds: inviteType === "all" ? [] : invitees,
                classId: classID,
                meetingDetails: {
                    roomId: meetingCode,
                    code: meetingCode,
                    password,
                    subject: subjectName,
                    className,
                    teacher: currentUser.name
                }
            });
            setTimeout(() => socket.disconnect(), 2000);
        } catch (err) {
            console.error("Socket emit error:", err);
        }

        // Redirect teacher directly to the meeting room
        navigate(`${meetingUrl}?pass=${password}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => setCopied(true));
    };

    return (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 720,
                    p: 4,
                    borderRadius: "24px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                    background: "linear-gradient(145deg, #ffffff, #f8f7ff)"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: "16px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex" }}>
                        <VideoCallIcon sx={{ fontSize: 32, color: "#fff" }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Launch Live Class
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Start a video conference for <strong>{className}</strong> · {subjectName}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={submitHandler}>
                    {/* Meeting Code */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupsIcon fontSize="small" sx={{ color: "#7c3aed" }} /> Meeting Code
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                fullWidth
                                value={meetingCode}
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontFamily: "monospace", fontWeight: 700, letterSpacing: 2, fontSize: 18, borderRadius: "12px" }
                                }}
                            />
                            <Tooltip title="Copy code">
                                <IconButton onClick={() => copyToClipboard(meetingCode)} sx={{ color: "#7c3aed" }}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Generate new code">
                                <IconButton onClick={() => setMeetingCode(generateMeetingCode())} sx={{ color: "#7c3aed" }}>
                                    <AutorenewIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Password */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <LockIcon fontSize="small" sx={{ color: "#7c3aed" }} /> Room Password / PIN
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{ sx: { fontFamily: "monospace", fontWeight: 700, fontSize: 20, borderRadius: "12px", letterSpacing: 4 } }}
                            />
                            <Tooltip title="Copy password">
                                <IconButton onClick={() => copyToClipboard(password)} sx={{ color: "#7c3aed" }}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Generate new password">
                                <IconButton onClick={() => setPassword(generatePassword())} sx={{ color: "#7c3aed" }}>
                                    <AutorenewIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <FormControl component="fieldset" sx={{ mb: 4, width: "100%" }}>
                        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
                            Who to Invite?
                        </FormLabel>
                        <RadioGroup
                            row
                            value={inviteType}
                            onChange={(e) => setInviteType(e.target.value)}
                        >
                            <FormControlLabel value="all" control={<Radio color="secondary" />} label="Entire Class" />
                            <FormControlLabel value="manual" control={<Radio color="secondary" />} label="Select Students Manually" />
                        </RadioGroup>
                    </FormControl>

                    {inviteType === "manual" && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Student List ({selectedStudents.length} selected)
                            </Typography>
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Paper variant="outlined" sx={{ p: 2, maxHeight: 250, overflow: "auto", borderRadius: "12px" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedStudents.length === sclassStudents.length}
                                                indeterminate={selectedStudents.length > 0 && selectedStudents.length < sclassStudents.length}
                                                onChange={handleSelectAll}
                                                color="secondary"
                                            />
                                        }
                                        label="Select All Students"
                                        sx={{ width: "100%", mb: 1 }}
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <FormGroup>
                                        {sclassStudents && sclassStudents.map((student) => (
                                            <FormControlLabel
                                                key={student._id}
                                                control={
                                                    <Checkbox
                                                        checked={selectedStudents.includes(student._id)}
                                                        onChange={() => handleSelectStudent(student._id)}
                                                        color="secondary"
                                                    />
                                                }
                                                label={`${student.name} (Roll: ${student.rollNum})`}
                                            />
                                        ))}
                                    </FormGroup>
                                </Paper>
                            )}
                        </Box>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loader}
                        sx={{
                            py: 1.8,
                            borderRadius: "14px",
                            fontWeight: 700,
                            fontSize: 16,
                            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                            boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                                boxShadow: "0 8px 25px rgba(124, 58, 237, 0.5)"
                            }
                        }}
                    >
                        {loader ? <CircularProgress size={24} color="inherit" /> : "🚀 Start Live Meeting"}
                    </Button>
                </form>
            </Paper>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ fontWeight: 600 }}>Copied to clipboard!</Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherMeeting;
