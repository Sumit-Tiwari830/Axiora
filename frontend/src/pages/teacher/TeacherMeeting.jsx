import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Divider,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Switch,
    Avatar,
    Card,
    CardContent,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@mui/material";
import { 
    VideoCall as VideoCallIcon, 
    Autorenew as AutorenewIcon,
    ContentCopy as ContentCopyIcon,
    Groups as GroupsIcon,
    Lock as LockIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
    InfoOutlined as InfoIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    School as SchoolIcon,
    CastForEducation as ClassIcon
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
    const [allowVoice, setAllowVoice] = useState(true);
    const [allowVideo, setAllowVideo] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const classID = currentUser?.teachSclass?._id;
    const className = currentUser?.teachSclass?.sclassName || "Class";
    const subjectName = currentUser?.teachSubject?.subName || "Live Class";

    const generateMeetingCode = () => {
        const p1 = Math.random().toString(36).substring(2, 5);
        const p2 = Math.random().toString(36).substring(2, 6);
        const p3 = Math.random().toString(36).substring(2, 5);
        return `${p1}-${p2}-${p3}`;
    };

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

        // Create Notice
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

        // Socket Notification
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

        navigate(`${meetingUrl}?pass=${password}&allowVoice=${allowVoice}&allowVideo=${allowVideo}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => setCopied(true));
    };

    // Filter students based on search term
    const filteredStudents = sclassStudents ? sclassStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.rollNum && student.rollNum.toString().includes(searchTerm))
    ) : [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header Banner */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff",
                    boxShadow: "0 10px 30px rgba(124, 58, 237, 0.2)"
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    border: "2px solid rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                <VideoCallIcon sx={{ fontSize: 36, color: "#fff" }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
                                    Live Class Command Center
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5, fontSize: "0.95rem" }}>
                                    Host interactive video classes, set student permissions, and invite attendees in real-time.
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: "right" } }}>
                        <Box
                            sx={{
                                display: "inline-flex",
                                px: 2,
                                py: 1,
                                borderRadius: "100px",
                                background: "rgba(255,255,255,0.15)",
                                border: "1px solid rgba(255,255,255,0.25)"
                            }}
                        >
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", mr: 1, alignSelf: "center", animation: "pulse 2s infinite" }} />
                            <Typography variant="caption" fontWeight={600}>
                                System Ready
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={4}>
                {/* Launcher Form */}
                <Grid item xs={12} lg={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: "24px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            background: "#fff"
                        }}
                    >
                        <form onSubmit={submitHandler}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                ⚙️ Class Configuration
                            </Typography>

                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: "#475569" }}>
                                        Meeting Code
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={meetingCode}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ gap: 0.5 }}>
                                                    <Tooltip title="Copy code">
                                                        <IconButton 
                                                            onClick={() => copyToClipboard(meetingCode)}
                                                            sx={{ 
                                                                color: "#7c3aed",
                                                                background: "rgba(124, 58, 237, 0.05)",
                                                                "&:hover": { background: "rgba(124, 58, 237, 0.1)" },
                                                                width: 34, height: 34
                                                            }}
                                                        >
                                                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Generate new code">
                                                        <IconButton 
                                                            onClick={() => setMeetingCode(generateMeetingCode())}
                                                            sx={{ 
                                                                color: "#7c3aed",
                                                                background: "rgba(124, 58, 237, 0.05)",
                                                                "&:hover": { background: "rgba(124, 58, 237, 0.1)" },
                                                                width: 34, height: 34
                                                            }}
                                                        >
                                                            <AutorenewIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                            sx: { 
                                                fontFamily: "monospace", 
                                                fontWeight: 700, 
                                                letterSpacing: 1, 
                                                fontSize: 16, 
                                                borderRadius: "14px",
                                                backgroundColor: "#fafbfc"
                                            }
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "rgba(226, 232, 240, 0.8)" },
                                                "&:hover fieldset": { borderColor: "rgba(124, 58, 237, 0.3)" },
                                                "&.Mui-focused fieldset": { borderColor: "#7c3aed" }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: "#475569" }}>
                                        Room Password / PIN
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ gap: 0.5 }}>
                                                    <Tooltip title="Copy password">
                                                        <IconButton 
                                                            onClick={() => copyToClipboard(password)}
                                                            sx={{ 
                                                                color: "#7c3aed",
                                                                background: "rgba(124, 58, 237, 0.05)",
                                                                "&:hover": { background: "rgba(124, 58, 237, 0.1)" },
                                                                width: 34, height: 34
                                                            }}
                                                        >
                                                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Generate new password">
                                                        <IconButton 
                                                            onClick={() => setPassword(generatePassword())}
                                                            sx={{ 
                                                                color: "#7c3aed",
                                                                background: "rgba(124, 58, 237, 0.05)",
                                                                "&:hover": { background: "rgba(124, 58, 237, 0.1)" },
                                                                width: 34, height: 34
                                                            }}
                                                        >
                                                            <AutorenewIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                            sx: { 
                                                fontFamily: "monospace", 
                                                fontWeight: 700, 
                                                letterSpacing: 2, 
                                                fontSize: 16, 
                                                borderRadius: "14px",
                                                backgroundColor: "#fafbfc"
                                            }
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "rgba(226, 232, 240, 0.8)" },
                                                "&:hover fieldset": { borderColor: "rgba(124, 58, 237, 0.3)" },
                                                "&.Mui-focused fieldset": { borderColor: "#7c3aed" }
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Permissions Cards */}
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "#475569" }}>
                                Default Student Permissions
                            </Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: "16px",
                                            background: allowVoice ? "rgba(34, 197, 94, 0.04)" : "rgba(239, 68, 68, 0.04)",
                                            border: `1.5px solid ${allowVoice ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        <CardContent sx={{ p: "20px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ background: allowVoice ? "#22c55e" : "#ef4444", width: 40, height: 40 }}>
                                                    {allowVoice ? <MicIcon /> : <MicOffIcon />}
                                                </Avatar>
                                                <Box>
                                                    <Typography fontWeight={700} fontSize="0.95rem">Microphones</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {allowVoice ? "Students can talk" : "Muted on join"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Switch checked={allowVoice} onChange={(e) => setAllowVoice(e.target.checked)} color="success" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: "16px",
                                            background: allowVideo ? "rgba(34, 197, 94, 0.04)" : "rgba(239, 68, 68, 0.04)",
                                            border: `1.5px solid ${allowVideo ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        <CardContent sx={{ p: "20px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar sx={{ background: allowVideo ? "#22c55e" : "#ef4444", width: 40, height: 40 }}>
                                                    {allowVideo ? <VideocamIcon /> : <VideocamOffIcon />}
                                                </Avatar>
                                                <Box>
                                                    <Typography fontWeight={700} fontSize="0.95rem">Cameras</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {allowVideo ? "Cameras enabled" : "Cameras locked"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Switch checked={allowVideo} onChange={(e) => setAllowVideo(e.target.checked)} color="success" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Who to Invite Selector */}
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "#475569" }}>
                                Target Invitation Audience
                            </Typography>
                            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        onClick={() => setInviteType("all")}
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: "16px",
                                            border: `2px solid ${inviteType === "all" ? "#7c3aed" : "rgba(226, 232, 240, 0.8)"}`,
                                            background: inviteType === "all" ? "rgba(124, 58, 237, 0.03)" : "#fff",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <GroupsIcon sx={{ fontSize: 32, color: inviteType === "all" ? "#7c3aed" : "#94a3b8", mb: 1 }} />
                                        <Typography fontWeight={700} fontSize="0.95rem" color={inviteType === "all" ? "#7c3aed" : "#475569"}>
                                            Entire Class
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Notify all enrolled students
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        onClick={() => setInviteType("manual")}
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: "16px",
                                            border: `2px solid ${inviteType === "manual" ? "#7c3aed" : "rgba(226, 232, 240, 0.8)"}`,
                                            background: inviteType === "manual" ? "rgba(124, 58, 237, 0.03)" : "#fff",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <ClassIcon sx={{ fontSize: 32, color: inviteType === "manual" ? "#7c3aed" : "#94a3b8", mb: 1 }} />
                                        <Typography fontWeight={700} fontSize="0.95rem" color={inviteType === "manual" ? "#7c3aed" : "#475569"}>
                                            Custom Select
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Pick specific attendees to join
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Manual Selection List */}
                            {inviteType === "manual" && (
                                <Box sx={{ mb: 4 }} className="animate-fadeIn">
                                    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
                                        <TextField
                                            size="small"
                                            placeholder="Search student by name or roll..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            sx={{ flexGrow: 1, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedStudents.length === sclassStudents.length}
                                                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < sclassStudents.length}
                                                    onChange={handleSelectAll}
                                                    color="secondary"
                                                    icon={<UncheckedIcon />}
                                                    checkedIcon={<CheckCircleIcon />}
                                                />
                                            }
                                            label={<Typography fontWeight={600} fontSize="0.85rem">Select All Enrolled</Typography>}
                                        />
                                    </Box>

                                    {loading ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                            <CircularProgress size={30} />
                                        </Box>
                                    ) : (
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                maxHeight: 280,
                                                overflow: "auto",
                                                borderRadius: "16px",
                                                borderColor: "rgba(226, 232, 240, 0.8)",
                                                background: "#fafbfc"
                                            }}
                                        >
                                            {filteredStudents.length === 0 ? (
                                                <Box sx={{ py: 6, textCenter: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                                    <InfoIcon sx={{ color: "#94a3b8", mb: 1, fontSize: 32 }} />
                                                    <Typography color="text.secondary" variant="body2">No students found matching your query.</Typography>
                                                </Box>
                                            ) : (
                                                <List sx={{ py: 0 }}>
                                                    {filteredStudents.map((student, idx) => {
                                                        const isSelected = selectedStudents.includes(student._id);
                                                        return (
                                                            <React.Fragment key={student._id}>
                                                                <ListItem
                                                                    button
                                                                    onClick={() => handleSelectStudent(student._id)}
                                                                    sx={{
                                                                        py: 1,
                                                                        px: 2.5,
                                                                        background: isSelected ? "rgba(124, 58, 237, 0.04)" : "transparent",
                                                                        "&:hover": { background: "rgba(124, 58, 237, 0.08)" }
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={isSelected}
                                                                        color="secondary"
                                                                        icon={<UncheckedIcon />}
                                                                        checkedIcon={<CheckCircleIcon />}
                                                                        sx={{ mr: 2 }}
                                                                    />
                                                                    <ListItemAvatar>
                                                                        <Avatar sx={{ bgcolor: isSelected ? "#7c3aed" : "#e2e8f0", color: isSelected ? "#fff" : "#4f46e5" }}>
                                                                            <SchoolIcon fontSize="small" />
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={<Typography fontWeight={600} fontSize="0.9rem">{student.name}</Typography>}
                                                                        secondary={`Roll: ${student.rollNum || "N/A"}`}
                                                                    />
                                                                </ListItem>
                                                                {idx < filteredStudents.length - 1 && <Divider sx={{ borderColor: "rgba(226, 232, 240, 0.5)" }} />}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </List>
                                            )}
                                        </Paper>
                                    )}
                                    <Typography variant="caption" sx={{ mt: 1, display: "block", color: "#64748b", fontWeight: 500 }}>
                                        Selected: <strong>{selectedStudents.length}</strong> of <strong>{sclassStudents?.length || 0}</strong> students.
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loader}
                                startIcon={!loader && <VideoCallIcon />}
                                sx={{
                                    py: 2,
                                    borderRadius: "16px",
                                    fontWeight: 800,
                                    fontSize: 16,
                                    textTransform: "none",
                                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                    boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #3730a3, #6d28d9)",
                                        boxShadow: "0 8px 25px rgba(124, 58, 237, 0.5)",
                                        transform: "translateY(-1px)"
                                    },
                                    transition: "all 0.2s"
                                }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "🚀 Launch Live Classroom"}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Sidebar Info */}
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: "24px",
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                                    border: "1px solid rgba(226, 232, 240, 0.8)",
                                    background: "#fff"
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    🎓 Class Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>ASSIGNED CLASS</Typography>
                                        <Typography variant="body1" fontWeight={700} color="#1e293b">{className}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>SUBJECT</Typography>
                                        <Typography variant="body1" fontWeight={700} color="#1e293b">{subjectName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>INSTRUCTOR</Typography>
                                        <Typography variant="body1" fontWeight={700} color="#1e293b">{currentUser?.name}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3.5,
                                    borderRadius: "24px",
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                                    border: "1px solid rgba(226, 232, 240, 0.8)",
                                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    💡 Hosting Best Practices
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                        <Typography fontSize="1.2rem">🎙️</Typography>
                                        <Box>
                                            <Typography fontWeight={700} fontSize="0.875rem" color="#334155">Mute on Entrance</Typography>
                                            <Typography variant="caption" color="text.secondary">Use the permissions switch to keep mics muted initially to avoid background echoes.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                        <Typography fontSize="1.2rem">📋</Typography>
                                        <Box>
                                            <Typography fontWeight={700} fontSize="0.875rem" color="#334155">Share Codes Directly</Typography>
                                            <Typography variant="caption" color="text.secondary">Enrolled students automatically receive a push notification, but you can copy the code/password to share in chats.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                        <Typography fontSize="1.2rem">💻</Typography>
                                        <Box>
                                            <Typography fontWeight={700} fontSize="0.875rem" color="#334155">Real-time Control</Typography>
                                            <Typography variant="caption" color="text.secondary">You can override permissions, mute individual students, or grant screen share rights from the in-room options.</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />

            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" sx={{ fontWeight: 600, borderRadius: "10px" }}>Copied to clipboard!</Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherMeeting;
