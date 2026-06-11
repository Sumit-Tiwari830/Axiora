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
    MenuItem,
    Select,
    InputLabel,
    Switch
} from "@mui/material";
import {
    VideoCall as VideoCallIcon,
    Autorenew as AutorenewIcon,
    ContentCopy as ContentCopyIcon,
    Groups as GroupsIcon,
    Lock as LockIcon,
    Class as ClassIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon
} from "@mui/icons-material";
import { io } from "socket.io-client";

import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import Popup from "../../components/Popup";

const AdminMeeting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { sclassesList, sclassStudents, loading } = useSelector((state) => state.sclass);

    const [meetingCode, setMeetingCode] = useState("");
    const [password, setPassword] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [inviteType, setInviteType] = useState("all");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [allowVoice, setAllowVoice] = useState(true);
    const [allowVideo, setAllowVideo] = useState(true);

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const generateMeetingCode = () => {
        const p1 = Math.random().toString(36).substring(2, 5);
        const p2 = Math.random().toString(36).substring(2, 6);
        const p3 = Math.random().toString(36).substring(2, 5);
        return `${p1}-${p2}-${p3}`;
    };

    const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString();

    useEffect(() => {
        setMeetingCode(generateMeetingCode());
        setPassword(generatePassword());
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [dispatch, currentUser._id]);

    useEffect(() => {
        if (selectedClass) {
            dispatch(getClassStudents(selectedClass));
            setSelectedStudents([]);
        }
    }, [selectedClass, dispatch]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedStudents(sclassStudents.map((s) => s._id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
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
        const selectedClassName = sclassesList?.find((c) => c._id === selectedClass)?.sclassName || "All Classes";

        try {
            const baseUrl = (import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/api")
                .replace("/api", "")
                .replace(/\/$/, "");
            const socket = io(baseUrl, { transports: ["websocket", "polling"] });
            socket.emit("send-meeting-invite", {
                targetStudentIds: inviteType === "all" ? [] : invitees,
                classId: selectedClass,
                meetingDetails: {
                    roomId: meetingCode,
                    code: meetingCode,
                    password,
                    subject: "Live Session",
                    className: selectedClassName,
                    teacher: currentUser.name
                }
            });
            setTimeout(() => socket.disconnect(), 2000);
        } catch (err) {
            console.error("Socket emit error:", err);
        }

        navigate(`${meetingUrl}?pass=${password}&allowVoice=${allowVoice}&allowVideo=${allowVideo}`);
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
                    boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
                    background: "linear-gradient(145deg, #ffffff, #f8f7ff)"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: "16px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex" }}>
                        <VideoCallIcon sx={{ fontSize: 32, color: "#fff" }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={800} sx={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Launch Live Class
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Start a school-wide video conference session
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={submitHandler}>
                    {/* Select Class */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <ClassIcon fontSize="small" sx={{ color: "#7c3aed" }} /> Select Class
                        </Typography>
                        <FormControl fullWidth required>
                            <InputLabel>Choose a Class</InputLabel>
                            <Select
                                value={selectedClass}
                                label="Choose a Class"
                                onChange={(e) => setSelectedClass(e.target.value)}
                                sx={{ borderRadius: "12px" }}
                            >
                                {sclassesList?.map((cls) => (
                                    <MenuItem key={cls._id} value={cls._id}>{cls.sclassName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Meeting Code */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupsIcon fontSize="small" sx={{ color: "#7c3aed" }} /> Meeting Code
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                fullWidth value={meetingCode}
                                InputProps={{ readOnly: true, sx: { fontFamily: "monospace", fontWeight: 700, letterSpacing: 2, fontSize: 18, borderRadius: "12px" } }}
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
                                fullWidth value={password}
                                onChange={(e) => setPassword(e.target.value)} required
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

                    {/* Moderation Settings */}
                    <Box sx={{ mb: 4, p: 2.5, borderRadius: "16px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                            🛡️ Student Permissions (Set at launch)
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {allowVoice ? <MicIcon fontSize="small" sx={{ color: "#22c55e" }} /> : <MicOffIcon fontSize="small" sx={{ color: "#ef4444" }} />}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>Student Microphones</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {allowVoice ? "Students can unmute themselves" : "All students muted until you allow"}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch checked={allowVoice} onChange={(e) => setAllowVoice(e.target.checked)} color="success" />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {allowVideo ? <VideocamIcon fontSize="small" sx={{ color: "#22c55e" }} /> : <VideocamOffIcon fontSize="small" sx={{ color: "#ef4444" }} />}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>Student Cameras</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {allowVideo ? "Students can enable their camera" : "All cameras off until you allow"}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Switch checked={allowVideo} onChange={(e) => setAllowVideo(e.target.checked)} color="success" />
                            </Box>
                        </Box>
                    </Box>

                    {/* Invite Type */}
                    <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                        <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
                            Who to Invite?
                        </FormLabel>
                        <RadioGroup row value={inviteType} onChange={(e) => setInviteType(e.target.value)}>
                            <FormControlLabel value="all" control={<Radio color="secondary" />} label="Entire Class" />
                            <FormControlLabel value="manual" control={<Radio color="secondary" />} label="Select Students Manually" />
                        </RadioGroup>
                    </FormControl>

                    {/* Manual Student Selection */}
                    {inviteType === "manual" && selectedClass && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Student List ({selectedStudents.length} selected)
                            </Typography>
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Paper variant="outlined" sx={{ p: 2, maxHeight: 240, overflow: "auto", borderRadius: "12px" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedStudents.length === sclassStudents?.length && sclassStudents?.length > 0}
                                                indeterminate={selectedStudents.length > 0 && selectedStudents.length < sclassStudents?.length}
                                                onChange={handleSelectAll}
                                                color="secondary"
                                            />
                                        }
                                        label="Select All"
                                        sx={{ width: "100%", mb: 0.5 }}
                                    />
                                    <Divider sx={{ mb: 1 }} />
                                    <FormGroup>
                                        {sclassStudents?.map((student) => (
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
                        type="submit" fullWidth variant="contained" size="large"
                        disabled={loader || !selectedClass}
                        sx={{
                            py: 1.8, borderRadius: "14px", fontWeight: 700, fontSize: 16,
                            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                            boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
                            "&:hover": { background: "linear-gradient(135deg, #6d28d9, #1d4ed8)", boxShadow: "0 8px 25px rgba(124,58,237,0.5)" }
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

export default AdminMeeting;
