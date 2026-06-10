import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Grid,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Badge,
    Chip,
    Tooltip
} from "@mui/material";
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
    ScreenShare as ScreenShareIcon,
    StopScreenShare as StopScreenShareIcon,
    CallEnd as CallEndIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
    Send as SendIcon,
    Close as CloseIcon,
    FiberManualRecord as RecordIcon
} from "@mui/icons-material";
import { io } from "socket.io-client";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};

const MeetingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { currentUser, currentRole } = useSelector((state) => state.user);

    // Get passcode from query string (sent by teacher redirect or student invite)
    const searchParams = new URLSearchParams(location.search);
    const initialPass = searchParams.get("pass") || "";

    // ── Auth State ──────────────────────────────────────────────────────────────
    const [passwordInput, setPasswordInput] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(!initialPass);
    const [joinError, setJoinError] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [roomPassword] = useState(initialPass);

    // ── Media State ────────────────────────────────────────────────────────────
    const [localStream, setLocalStream] = useState(null);
    const [remotePeers, setRemotePeers] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ── UI State ───────────────────────────────────────────────────────────────
    const [sidePanel, setSidePanel] = useState(null); // null | "chat" | "people"
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [unreadChat, setUnreadChat] = useState(0);
    const [duration, setDuration] = useState(0);

    // ── Refs ───────────────────────────────────────────────────────────────────
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerConnections = useRef({});
    const localStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const chatEndRef = useRef(null);
    const timerRef = useRef(null);

    // ── Duration Timer ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (localStream) {
            timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [localStream]);

    const formatDuration = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    // ── Get local media ────────────────────────────────────────────────────────
    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (err) {
            console.warn("Camera failed, trying audio only:", err);
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = audioStream;
                setLocalStream(audioStream);
                return audioStream;
            } catch (fallbackErr) {
                console.error("Audio fallback failed:", fallbackErr);
                setJoinError("Failed to access camera or microphone. Please check browser permissions.");
                return null;
            }
        }
    };

    // ── Create RTCPeerConnection ───────────────────────────────────────────────
    const createPeerConnection = useCallback((socketId, userName, role, stream) => {
        if (peerConnections.current[socketId]) {
            return peerConnections.current[socketId];
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnections.current[socketId] = pc;

        // Add local tracks
        if (stream) {
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        }

        // ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current?.connected) {
                socketRef.current.emit("signal", {
                    to: socketId,
                    signal: { type: "candidate", candidate: event.candidate }
                });
            }
        };

        // Remote track received
        pc.ontrack = (event) => {
            const remoteStream = event.streams[0];
            setRemotePeers((prev) => {
                const exists = prev.find((p) => p.socketId === socketId);
                if (exists) {
                    return prev.map((p) => p.socketId === socketId ? { ...p, stream: remoteStream } : p);
                }
                return [...prev, { socketId, userName, role, stream: remoteStream }];
            });
        };

        pc.onconnectionstatechange = () => {
            console.log(`PC [${socketId}] state: ${pc.connectionState}`);
        };

        return pc;
    }, []);

    // ── Initialize Socket + WebRTC ─────────────────────────────────────────────
    const initMeeting = useCallback(async (passVal) => {
        const stream = await startLocalStream();
        if (!stream) return;

        const socketUrl = (import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/api").replace("/api", "");
        socketRef.current = io(socketUrl, { transports: ["websocket", "polling"] });

        socketRef.current.on("connect", () => {
            console.log("Socket connected:", socketRef.current.id);
            // Join room after connection
            socketRef.current.emit("join-room", {
                roomId,
                password: passVal,
                userId: currentUser._id,
                userName: currentUser.name,
                role: currentRole
            });
        });

        socketRef.current.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            setJoinError("Could not connect to meeting server. Please try again.");
            setIsJoining(false);
        });

        // Password error
        socketRef.current.on("join-error", (msg) => {
            setJoinError(msg || "Invalid meeting password.");
            setIsJoining(false);
            setIsPasswordModalOpen(true);
            socketRef.current.disconnect();
        });

        // Existing users in room → we initiate offers to them
        socketRef.current.on("all-users", (users) => {
            users.forEach(async (user) => {
                const pc = createPeerConnection(user.socketId, user.userName, user.role, localStreamRef.current);
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socketRef.current.emit("signal", {
                        to: user.socketId,
                        signal: { type: "offer", sdp: offer }
                    });
                } catch (err) {
                    console.error("Error creating offer:", err);
                }
            });
        });

        // Signaling handler
        socketRef.current.on("signal", async ({ from, signal, fromUserName, fromRole }) => {
            if (signal.type === "offer") {
                let pc = peerConnections.current[from];
                if (!pc) {
                    pc = createPeerConnection(from, fromUserName || "Peer", fromRole || "Student", localStreamRef.current);
                }
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socketRef.current.emit("signal", { to: from, signal: { type: "answer", sdp: answer } });
                } catch (err) {
                    console.error("Error handling offer:", err);
                }
            } else if (signal.type === "answer") {
                const pc = peerConnections.current[from];
                if (pc) {
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    } catch (err) {
                        console.error("Error setting answer:", err);
                    }
                }
            } else if (signal.type === "candidate") {
                const pc = peerConnections.current[from];
                if (pc && signal.candidate) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                    } catch (e) {
                        // Ignore non-fatal ICE errors
                    }
                }
            }
        });

        // New user joins — they'll offer to us; we just create a slot
        socketRef.current.on("user-joined", ({ socketId, userName, role }) => {
            console.log(`Peer joined: ${userName}`);
            // Don't proactively create PC here; wait for their offer
            setRemotePeers((prev) => {
                if (!prev.find((p) => p.socketId === socketId)) {
                    return [...prev, { socketId, userName, role, stream: null }];
                }
                return prev;
            });
        });

        // User left
        socketRef.current.on("user-left", (socketId) => {
            if (peerConnections.current[socketId]) {
                peerConnections.current[socketId].close();
                delete peerConnections.current[socketId];
            }
            setRemotePeers((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        // Chat messages
        socketRef.current.on("chat-message", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
            setSidePanel((panel) => {
                if (panel !== "chat") setUnreadChat((n) => n + 1);
                return panel;
            });
        });

    }, [roomId, currentUser, currentRole, createPeerConnection]);

    // Trigger join flow
    useEffect(() => {
        if (initialPass) {
            // Auto-join with password from URL
            setIsJoining(true);
            initMeeting(initialPass);
        }
        return () => cleanup();
    }, []); // eslint-disable-line

    const cleanup = () => {
        clearInterval(timerRef.current);
        if (socketRef.current) socketRef.current.disconnect();
        Object.values(peerConnections.current).forEach((pc) => pc.close());
        peerConnections.current = {};
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
        if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((t) => t.stop());
    };

    // ── Password Submit ────────────────────────────────────────────────────────
    const handlePasswordSubmit = () => {
        const pass = passwordInput.trim();
        if (!pass) { setJoinError("Password is required."); return; }
        setJoinError("");
        setIsPasswordModalOpen(false);
        setIsJoining(true);
        initMeeting(pass);
    };

    // ── Leave Meeting ──────────────────────────────────────────────────────────
    const leaveMeeting = () => {
        cleanup();
        navigate(currentRole === "Teacher" ? "/Teacher/dashboard" : "/Student/dashboard");
    };

    // ── Toggle Mute ────────────────────────────────────────────────────────────
    const toggleMute = () => {
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    // ── Toggle Video ───────────────────────────────────────────────────────────
    const toggleVideo = () => {
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!videoTrack.enabled);
        }
    };

    // ── Toggle Screen Share ────────────────────────────────────────────────────
    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
            const camVideoTrack = localStreamRef.current?.getVideoTracks()[0];
            Object.values(peerConnections.current).forEach((pc) => {
                const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
                if (videoSender && camVideoTrack) videoSender.replaceTrack(camVideoTrack);
            });
            if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                setIsScreenSharing(true);
                const screenVideoTrack = screenStream.getVideoTracks()[0];
                Object.values(peerConnections.current).forEach((pc) => {
                    const videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
                    if (videoSender) videoSender.replaceTrack(screenVideoTrack);
                });
                if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
                screenVideoTrack.onended = () => toggleScreenShare();
            } catch (err) {
                console.error("Screen share failed:", err);
            }
        }
    };

    // ── Send Chat Message ──────────────────────────────────────────────────────
    const sendChat = () => {
        const text = chatInput.trim();
        if (!text || !socketRef.current) return;
        const msg = {
            sender: currentUser.name,
            role: currentRole,
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        socketRef.current.emit("chat-message", { roomId, ...msg });
        setChatMessages((prev) => [...prev, msg]);
        setChatInput("");
    };

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Open side panel
    const openPanel = (panel) => {
        setSidePanel((prev) => (prev === panel ? null : panel));
        if (panel === "chat") setUnreadChat(0);
    };

    const totalParticipants = 1 + remotePeers.length;

    // ──────────────────────────────────────────────────────────────────────────
    // RENDER
    // ──────────────────────────────────────────────────────────────────────────
    return (
        <Box sx={{ width: "100%", height: "100vh", background: "#0a0f1a", color: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>

            {/* ── TOP BAR ── */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5, background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.2)", flexShrink: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <RecordIcon sx={{ color: "#ef4444", fontSize: 16, animation: "pulse 1.5s infinite" }} />
                        <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 700, letterSpacing: 1 }}>LIVE</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.15)" }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {roomId}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                            {currentUser.name} · {currentRole} · {formatDuration(duration)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip label={`${totalParticipants} participant${totalParticipants !== 1 ? "s" : ""}`} size="small" sx={{ bgcolor: "rgba(99,102,241,0.2)", color: "#a5b4fc", borderColor: "rgba(99,102,241,0.4)", border: "1px solid" }} />
                </Box>
            </Box>

            {/* ── MAIN AREA ── */}
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* ── VIDEO GRID ── */}
                <Box sx={{ flex: 1, p: 2, overflow: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                    {isJoining && !localStream ? (
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", gap: 3 }}>
                            <CircularProgress size={60} sx={{ color: "#6366f1" }} />
                            <Typography variant="h6" sx={{ color: "#94a3b8" }}>Connecting to the classroom...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ flex: 1 }}>
                            {/* Local video */}
                            <Grid item xs={12} sm={remotePeers.filter(p => p.stream).length > 0 ? 6 : 12} md={remotePeers.filter(p => p.stream).length > 0 ? 6 : 8}>
                                <VideoTile
                                    videoRef={localVideoRef}
                                    label={`${currentUser.name} (You)`}
                                    sublabel={currentRole}
                                    isMuted={isMuted}
                                    isVideoOff={isVideoOff}
                                    isLocal
                                    isScreenSharing={isScreenSharing}
                                />
                            </Grid>

                            {/* Remote videos */}
                            {remotePeers.map((peer) => (
                                <Grid item xs={12} sm={6} md={6} key={peer.socketId}>
                                    <RemoteVideoTile peer={peer} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* ── SIDE PANEL ── */}
                {sidePanel && (
                    <Box sx={{ width: 320, background: "rgba(15,23,42,0.98)", borderLeft: "1px solid rgba(99,102,241,0.2)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                            <Typography fontWeight={700}>{sidePanel === "chat" ? "Class Chat" : "Participants"}</Typography>
                            <IconButton size="small" onClick={() => setSidePanel(null)} sx={{ color: "#94a3b8" }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {sidePanel === "chat" ? (
                            <>
                                <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {chatMessages.length === 0 && (
                                        <Typography variant="body2" sx={{ color: "#475569", textAlign: "center", mt: 4 }}>No messages yet. Start the conversation!</Typography>
                                    )}
                                    {chatMessages.map((msg, i) => (
                                        <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: msg.sender === currentUser.name ? "flex-end" : "flex-start" }}>
                                            <Typography variant="caption" sx={{ color: "#64748b", mb: 0.5 }}>
                                                {msg.sender} · {msg.time}
                                            </Typography>
                                            <Box sx={{ bgcolor: msg.sender === currentUser.name ? "#6366f1" : "rgba(51,65,85,0.8)", px: 2, py: 1, borderRadius: msg.sender === currentUser.name ? "16px 16px 4px 16px" : "16px 16px 16px 4px", maxWidth: "85%" }}>
                                                <Typography variant="body2">{msg.text}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                    <div ref={chatEndRef} />
                                </Box>
                                <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Type a message..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", color: "#fff", "& fieldset": { borderColor: "rgba(99,102,241,0.3)" }, "&:hover fieldset": { borderColor: "#6366f1" } }, "& .MuiInputBase-input::placeholder": { color: "#475569" } }}
                                    />
                                    <IconButton onClick={sendChat} sx={{ bgcolor: "#6366f1", color: "#fff", "&:hover": { bgcolor: "#4f46e5" }, borderRadius: "12px", width: 40, height: 40 }}>
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <List sx={{ flex: 1, overflowY: "auto", p: 1 }}>
                                <ListItem sx={{ borderRadius: "12px", "&:hover": { bgcolor: "rgba(99,102,241,0.1)" } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "#6366f1", width: 36, height: 36, fontSize: 14 }}>
                                            {currentUser.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${currentUser.name} (You)`}
                                        secondary={currentRole}
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}
                                        secondaryTypographyProps={{ fontSize: 12, color: "#64748b" }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 0.5 }} />
                                {remotePeers.map((peer) => (
                                    <ListItem key={peer.socketId} sx={{ borderRadius: "12px", "&:hover": { bgcolor: "rgba(99,102,241,0.1)" } }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: peer.role === "Teacher" ? "#7c3aed" : "#334155", width: 36, height: 36, fontSize: 14 }}>
                                                {peer.userName?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={peer.userName}
                                            secondary={peer.role}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}
                                            secondaryTypographyProps={{ fontSize: 12, color: "#64748b" }}
                                        />
                                        {peer.stream && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </Box>

            {/* ── CONTROL BAR ── */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, py: 2.5, background: "rgba(15,23,42,0.97)", borderTop: "1px solid rgba(99,102,241,0.2)", flexShrink: 0 }}>
                <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                    <IconButton onClick={toggleMute} sx={{ bgcolor: isMuted ? "#ef4444" : "rgba(51,65,85,0.8)", color: "#fff", width: 52, height: 52, "&:hover": { bgcolor: isMuted ? "#dc2626" : "rgba(71,85,105,0.9)" }, transition: "all 0.2s" }}>
                        {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={isVideoOff ? "Start Video" : "Stop Video"}>
                    <IconButton onClick={toggleVideo} sx={{ bgcolor: isVideoOff ? "#ef4444" : "rgba(51,65,85,0.8)", color: "#fff", width: 52, height: 52, "&:hover": { bgcolor: isVideoOff ? "#dc2626" : "rgba(71,85,105,0.9)" }, transition: "all 0.2s" }}>
                        {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
                    <IconButton onClick={toggleScreenShare} sx={{ bgcolor: isScreenSharing ? "#22c55e" : "rgba(51,65,85,0.8)", color: "#fff", width: 52, height: 52, "&:hover": { bgcolor: isScreenSharing ? "#16a34a" : "rgba(71,85,105,0.9)" }, transition: "all 0.2s" }}>
                        {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Participants">
                    <IconButton onClick={() => openPanel("people")} sx={{ bgcolor: sidePanel === "people" ? "#6366f1" : "rgba(51,65,85,0.8)", color: "#fff", width: 52, height: 52, "&:hover": { bgcolor: sidePanel === "people" ? "#4f46e5" : "rgba(71,85,105,0.9)" }, transition: "all 0.2s" }}>
                        <Badge badgeContent={totalParticipants} color="primary" sx={{ "& .MuiBadge-badge": { bgcolor: "#22c55e", fontSize: 10 } }}>
                            <PeopleIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Chat">
                    <IconButton onClick={() => openPanel("chat")} sx={{ bgcolor: sidePanel === "chat" ? "#6366f1" : "rgba(51,65,85,0.8)", color: "#fff", width: 52, height: 52, "&:hover": { bgcolor: sidePanel === "chat" ? "#4f46e5" : "rgba(71,85,105,0.9)" }, transition: "all 0.2s" }}>
                        <Badge badgeContent={unreadChat} color="error">
                            <ChatIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Box sx={{ width: 1, height: 48, bgcolor: "rgba(255,255,255,0.12)", borderRadius: 1 }} />

                <Button
                    variant="contained"
                    startIcon={<CallEndIcon />}
                    onClick={leaveMeeting}
                    sx={{ bgcolor: "#ef4444", color: "#fff", px: 3, py: 1.5, borderRadius: "14px", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" }, boxShadow: "0 4px 15px rgba(239,68,68,0.4)" }}
                >
                    Leave Class
                </Button>
            </Box>

            {/* ── PASSWORD MODAL ── */}
            <Dialog open={isPasswordModalOpen} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", background: "#1e293b", color: "#fff" } }}>
                <DialogTitle sx={{ fontWeight: 700, pt: 3, pb: 1 }}>
                    🔐 Enter Class Password
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
                        Your teacher has shared a password to join this live class. Enter it below.
                    </Typography>
                    <TextField
                        fullWidth
                        type="password"
                        label="Class Password / PIN"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                        error={!!joinError}
                        helperText={joinError}
                        autoFocus
                        sx={{ "& .MuiOutlinedInput-root": { color: "#fff", "& fieldset": { borderColor: "rgba(99,102,241,0.4)" }, "&:hover fieldset": { borderColor: "#6366f1" } }, "& .MuiInputLabel-root": { color: "#94a3b8" } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => navigate(-1)} sx={{ color: "#94a3b8", fontWeight: 600, borderRadius: "10px" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordSubmit}
                        variant="contained"
                        sx={{ bgcolor: "#6366f1", fontWeight: 700, borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#4f46e5" } }}
                    >
                        Join Class
                    </Button>
                </DialogActions>
            </Dialog>

            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </Box>
    );
};

// ── Video Tile Components ──────────────────────────────────────────────────────

const VideoTile = ({ videoRef, label, sublabel, isMuted, isVideoOff, isLocal, isScreenSharing }) => (
    <Box sx={{ position: "relative", bgcolor: "#0f172a", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(99,102,241,0.3)", height: "100%", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { border: "2px solid rgba(99,102,241,0.7)", transition: "border 0.2s" } }}>
        {isVideoOff && isLocal ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: 32, bgcolor: "#6366f1" }}>
                    {label?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>Camera is off</Typography>
            </Box>
        ) : (
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: isLocal && !isScreenSharing ? "scaleX(-1)" : "none" }}
            />
        )}
        {/* Name overlay */}
        <Box sx={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: 1, bgcolor: "rgba(15,23,42,0.8)", px: 1.5, py: 0.5, borderRadius: "8px", backdropFilter: "blur(8px)" }}>
            {isMuted && isLocal && <MicOffIcon sx={{ fontSize: 14, color: "#ef4444" }} />}
            <Typography variant="caption" fontWeight={600}>{label}</Typography>
        </Box>
        {/* Role badge */}
        {sublabel && (
            <Box sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(99,102,241,0.7)", px: 1.5, py: 0.3, borderRadius: "6px", backdropFilter: "blur(8px)" }}>
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: 10 }}>{sublabel}</Typography>
            </Box>
        )}
        {isScreenSharing && (
            <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(34,197,94,0.8)", px: 1.5, py: 0.3, borderRadius: "6px" }}>
                <Typography variant="caption" fontWeight={700} sx={{ fontSize: 10 }}>📺 SHARING SCREEN</Typography>
            </Box>
        )}
    </Box>
);

const RemoteVideoTile = ({ peer }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && peer.stream) {
            videoRef.current.srcObject = peer.stream;
        }
    }, [peer.stream]);

    return (
        <Box sx={{ position: "relative", bgcolor: "#0f172a", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(99,102,241,0.2)", height: "100%", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { border: "2px solid rgba(99,102,241,0.6)", transition: "border 0.2s" } }}>
            {!peer.stream ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={40} sx={{ color: "#6366f1" }} />
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>Connecting {peer.userName}...</Typography>
                </Box>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            )}
            <Box sx={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: 1, bgcolor: "rgba(15,23,42,0.8)", px: 1.5, py: 0.5, borderRadius: "8px", backdropFilter: "blur(8px)" }}>
                <Typography variant="caption" fontWeight={600}>{peer.userName}</Typography>
            </Box>
            <Box sx={{ position: "absolute", top: 12, right: 12, bgcolor: peer.role === "Teacher" ? "rgba(124,58,237,0.7)" : "rgba(51,65,85,0.7)", px: 1.5, py: 0.3, borderRadius: "6px" }}>
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: 10 }}>{peer.role}</Typography>
            </Box>
        </Box>
    );
};

export default MeetingRoom;
