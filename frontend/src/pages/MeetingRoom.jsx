import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    FiberManualRecord as RecordIcon,
    StopCircle as StopCircleIcon
} from "@mui/icons-material";
import { io } from "socket.io-client";

// STUN servers for NAT traversal
const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
//  MeetingRoom Component
// ─────────────────────────────────────────────────────────────────────────────
const MeetingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, currentRole } = useSelector((s) => s.user);

    const searchParams = new URLSearchParams(location.search);
    const initialPass = searchParams.get("pass") || "";

    // ── Auth ─────────────────────────────────────────────────────
    const [passwordInput, setPasswordInput] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(!initialPass);
    const [joinError, setJoinError] = useState("");
    const [hasJoined, setHasJoined] = useState(false);

    // ── Media ────────────────────────────────────────────────────
    const [localStream, setLocalStream] = useState(null);
    const [peers, setPeers] = useState([]); // [{ socketId, userName, role, stream }]
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ── Class Ended State ─────────────────────────────────────────
    const [classEnded, setClassEnded] = useState(false);
    const [classEndedInfo, setClassEndedInfo] = useState(null);
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    // ── UI ───────────────────────────────────────────────────────
    const [sidePanel, setSidePanel] = useState(null); // null | "chat" | "people"
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [unreadChat, setUnreadChat] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isConnecting, setIsConnecting] = useState(false);

    // ── Refs ─────────────────────────────────────────────────────
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerConnections = useRef({});     // socketId → RTCPeerConnection
    const localStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const chatEndRef = useRef(null);
    const timerRef = useRef(null);
    const candidateQueue = useRef({});      // socketId → [RTCIceCandidate]

    // Assign local stream to video element whenever either changes
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, hasJoined]);

    // Duration timer starts when connected
    useEffect(() => {
        if (hasJoined) {
            timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [hasJoined]);

    const formatDuration = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    // ── Acquire local media ────────────────────────────────────────
    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.warn("Camera+Audio failed, trying audio only:", err.name, err.message);
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = audioStream;
                setLocalStream(audioStream);
                setIsVideoOff(true);
                return audioStream;
            } catch (audioErr) {
                console.error("Audio also failed:", audioErr);
                setJoinError("Cannot access camera or microphone. Check browser permissions and try again.");
                return null;
            }
        }
    };

    // ── Create RTCPeerConnection ───────────────────────────────────
    const createPC = useCallback((socketId, userName, role) => {
        // Avoid duplicate connections
        if (peerConnections.current[socketId]) {
            return peerConnections.current[socketId];
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnections.current[socketId] = pc;

        // Add ALL local tracks to this connection
        const stream = localStreamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
        }

        // Send ICE candidates to the peer
        pc.onicecandidate = ({ candidate }) => {
            if (candidate && socketRef.current?.connected) {
                socketRef.current.emit("signal", {
                    to: socketId,
                    signal: { type: "candidate", candidate }
                });
            }
        };

        // When we receive a remote media track
        pc.ontrack = (event) => {
            console.log(`[WebRTC] Received remote track:`, event.track.kind, `from`, userName);
            const remoteStream = event.streams[0];
            if (!remoteStream) return;
            setPeers((prev) => {
                const existing = prev.find((p) => p.socketId === socketId);
                // Create a new stream instance containing all tracks of remoteStream
                // to guarantee a reference change in React state.
                const streamCopy = new MediaStream(remoteStream.getTracks());
                if (existing) {
                    return prev.map((p) =>
                        p.socketId === socketId ? { ...p, stream: streamCopy } : p
                    );
                }
                return [...prev, { 
                    socketId, 
                    userName, 
                    role, 
                    stream: streamCopy, 
                    isMuted: false, 
                    isVideoOff: false 
                }];
            });
        };

        pc.onconnectionstatechange = () => {
            console.log(`[PC] ${userName} → ${pc.connectionState}`);
            if (pc.connectionState === "failed") {
                pc.restartIce();
            }
        };

        return pc;
    }, []);

    // ── Socket.io + WebRTC Init ────────────────────────────────────
    const initMeeting = useCallback(async (passVal) => {
        setIsConnecting(true);

        const stream = await startLocalStream();
        if (!stream) {
            setIsConnecting(false);
            return;
        }

        const baseUrl = (import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/api")
            .replace("/api", "")
            .replace(/\/$/, "");

        const socket = io(baseUrl, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 3
        });
        socketRef.current = socket;

        // ── Connection established ──────────────────────────────
        socket.on("connect", () => {
            console.log("[Socket] Connected:", socket.id);
            socket.emit("join-room", {
                roomId,
                password: passVal,
                userId: currentUser._id,
                userName: currentUser.name,
                role: currentRole,
                isMuted,
                isVideoOff
            });
        });

        socket.on("connect_error", (err) => {
            console.error("[Socket] Connection error:", err.message);
            setJoinError("Cannot connect to the meeting server. Is the backend running?");
            setIsConnecting(false);
        });

        // ── Room join errors ────────────────────────────────────
        socket.on("join-error", (msg) => {
            setJoinError(msg);
            setIsConnecting(false);
            setIsPasswordModalOpen(true);
            socket.disconnect();
        });

        // ── Class already ended ─────────────────────────────────
        socket.on("class-ended", ({ endedBy, endedAt }) => {
            setClassEnded(true);
            setClassEndedInfo({ endedBy, endedAt });
            setIsConnecting(false);
            clearInterval(timerRef.current);
            // Stop all local media
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            // Close all peer connections
            Object.values(peerConnections.current).forEach((pc) => pc.close());
            peerConnections.current = {};
            setPeers([]);
        });

        // ── Existing users in room → I create offer to each ────
        socket.on("all-users", (users) => {
            console.log("[Socket] Existing users:", users.length);
            setHasJoined(true);
            setIsConnecting(false);

            users.forEach(async (user) => {
                const pc = createPC(user.socketId, user.userName, user.role);
                // Add this peer placeholder immediately
                setPeers((prev) => {
                    if (!prev.find((p) => p.socketId === user.socketId)) {
                        return [...prev, { 
                            socketId: user.socketId, 
                            userName: user.userName, 
                            role: user.role, 
                            stream: null,
                            isMuted: user.isMuted || false,
                            isVideoOff: user.isVideoOff || false
                        }];
                    }
                    return prev;
                });
                try {
                    const offer = await pc.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true
                    });
                    await pc.setLocalDescription(offer);
                    socket.emit("signal", {
                        to: user.socketId,
                        signal: { type: "offer", sdp: offer }
                    });
                } catch (err) {
                    console.error("[WebRTC] Error creating offer:", err);
                }
            });

            // If no one else is in the room yet, we're still connected
            if (users.length === 0) {
                console.log("[Meeting] Waiting for others to join...");
            }
        });

        // ── Signaling: receive offer / answer / candidate ───────
        socket.on("signal", async ({ from, signal, fromUserName, fromRole }) => {
            if (signal.type === "offer") {
                // Someone sent us an offer — create PC, answer it
                let pc = peerConnections.current[from];
                if (!pc) {
                    pc = createPC(from, fromUserName || "Peer", fromRole || "Student");
                    // Add placeholder for the incoming peer
                    setPeers((prev) => {
                        if (!prev.find((p) => p.socketId === from)) {
                            return [...prev, { 
                                socketId: from, 
                                userName: fromUserName || "Peer", 
                                role: fromRole || "Student", 
                                stream: null,
                                isMuted: false,
                                isVideoOff: false
                            }];
                        }
                        return prev;
                    });
                }
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    
                    // Process queued candidates for this peer
                    if (candidateQueue.current[from]) {
                        for (const cand of candidateQueue.current[from]) {
                            try {
                                await pc.addIceCandidate(new RTCIceCandidate(cand));
                            } catch (e) {
                                console.warn("[WebRTC] Error adding queued ICE candidate:", e);
                            }
                        }
                        delete candidateQueue.current[from];
                    }

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit("signal", {
                        to: from,
                        signal: { type: "answer", sdp: answer }
                    });
                } catch (err) {
                    console.error("[WebRTC] Error handling offer:", err);
                }

            } else if (signal.type === "answer") {
                const pc = peerConnections.current[from];
                if (pc) {
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                        
                        // Process queued candidates for this peer
                        if (candidateQueue.current[from]) {
                            for (const cand of candidateQueue.current[from]) {
                                try {
                                    await pc.addIceCandidate(new RTCIceCandidate(cand));
                                } catch (e) {
                                    console.warn("[WebRTC] Error adding queued ICE candidate:", e);
                                }
                            }
                            delete candidateQueue.current[from];
                        }
                    } catch (err) {
                        console.error("[WebRTC] Error setting answer:", err);
                    }
                }

            } else if (signal.type === "candidate") {
                const pc = peerConnections.current[from];
                if (pc && signal.candidate) {
                    if (pc.remoteDescription && pc.remoteDescription.type) {
                        try {
                            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                        } catch (e) {
                            // ICE candidate errors are usually non-fatal
                        }
                    } else {
                        // Queue the candidate until remote description is set
                        if (!candidateQueue.current[from]) {
                            candidateQueue.current[from] = [];
                        }
                        candidateQueue.current[from].push(signal.candidate);
                    }
                }
            }
        });

        // ── New user joined the room ────────────────────────────
        socket.on("user-joined", ({ socketId, userName, role, isMuted, isVideoOff }) => {
            console.log("[Meeting] New user joined:", userName);
            // They will send us an offer, so just add a placeholder
            setPeers((prev) => {
                if (!prev.find((p) => p.socketId === socketId)) {
                    return [...prev, { 
                        socketId, 
                        userName, 
                        role, 
                        stream: null, 
                        isMuted: isMuted || false, 
                        isVideoOff: isVideoOff || false 
                    }];
                }
                return prev;
            });
        });

        // ── Peer mute / video toggles ───────────────────────────
        socket.on("peer-mute-toggle", ({ socketId, isMuted }) => {
            setPeers((prev) =>
                prev.map((p) => (p.socketId === socketId ? { ...p, isMuted } : p))
            );
        });

        socket.on("peer-video-toggle", ({ socketId, isVideoOff }) => {
            setPeers((prev) =>
                prev.map((p) => (p.socketId === socketId ? { ...p, isVideoOff } : p))
            );
        });

        // ── User disconnected ───────────────────────────────────
        socket.on("user-left", (socketId) => {
            console.log("[Meeting] User left:", socketId);
            if (peerConnections.current[socketId]) {
                peerConnections.current[socketId].close();
                delete peerConnections.current[socketId];
            }
            delete candidateQueue.current[socketId];
            setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        // ── Chat ────────────────────────────────────────────────
        socket.on("chat-message", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
            setSidePanel((current) => {
                if (current !== "chat") {
                    setUnreadChat((n) => n + 1);
                }
                return current;
            });
        });

    }, [roomId, currentUser, currentRole, createPC, isMuted, isVideoOff]);

    // ── Entry point ────────────────────────────────────────────────
    useEffect(() => {
        if (initialPass) {
            initMeeting(initialPass);
        }
        return () => doCleanup();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const doCleanup = () => {
        clearInterval(timerRef.current);
        socketRef.current?.disconnect();
        Object.values(peerConnections.current).forEach((pc) => pc.close());
        peerConnections.current = {};
        candidateQueue.current = {};
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };

    // ── Password submit ────────────────────────────────────────────
    const handlePasswordSubmit = () => {
        const pass = passwordInput.trim();
        if (!pass) { setJoinError("Password is required."); return; }
        setJoinError("");
        setIsPasswordModalOpen(false);
        initMeeting(pass);
    };

    // ── Leave ──────────────────────────────────────────────────────
    const leaveMeeting = () => {
        doCleanup();
        navigate(currentRole === "Teacher" ? "/Teacher/dashboard" : "/Student/dashboard");
    };

    // ── End class (teacher/admin only) ─────────────────────────────
    const confirmEndClass = () => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("end-class", { roomId });
        }
        setShowEndConfirm(false);
    };

    // ── Toggle Mute ────────────────────────────────────────────────
    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            const newMuted = !track.enabled;
            setIsMuted(newMuted);
            socketRef.current?.emit("toggle-mute", { roomId, isMuted: newMuted });
        }
    };

    // ── Toggle Video ───────────────────────────────────────────────
    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            const newVideoOff = !track.enabled;
            setIsVideoOff(newVideoOff);
            socketRef.current?.emit("toggle-video", { roomId, isVideoOff: newVideoOff });
        }
    };

    // ── Screen Share ───────────────────────────────────────────────
    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
            const camTrack = localStreamRef.current?.getVideoTracks()[0];
            Object.values(peerConnections.current).forEach((pc) => {
                const sender = pc.getSenders().find((s) => s.track?.kind === "video");
                if (sender && camTrack) sender.replaceTrack(camTrack);
            });
            if (localVideoRef.current && localStreamRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
            }
        } else {
            try {
                const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screen;
                setIsScreenSharing(true);
                const screenTrack = screen.getVideoTracks()[0];
                Object.values(peerConnections.current).forEach((pc) => {
                    const sender = pc.getSenders().find((s) => s.track?.kind === "video");
                    if (sender) sender.replaceTrack(screenTrack);
                });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screen;
                }
                screenTrack.onended = () => toggleScreenShare();
            } catch (err) {
                console.error("[ScreenShare] Failed:", err);
            }
        }
    };

    // ── Chat send ──────────────────────────────────────────────────
    const sendChat = () => {
        const text = chatInput.trim();
        if (!text || !socketRef.current?.connected) return;
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const openPanel = (panel) => {
        setSidePanel((prev) => (prev === panel ? null : panel));
        if (panel === "chat") setUnreadChat(0);
    };

    const totalParticipants = 1 + peers.length;
    const canEndClass = currentRole === "Teacher" || currentRole === "Admin";

    // ─────────────────────────────────────────────────────────────
    //  CLASS ENDED SCREEN
    // ─────────────────────────────────────────────────────────────
    if (classEnded) {
        return (
            <Box sx={{ width: "100%", height: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 3, color: "#fff" }}>
                <Box sx={{ textAlign: "center", p: 5, borderRadius: "24px", background: "rgba(15,23,42,0.9)", border: "1px solid rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", maxWidth: 500 }}>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2, border: "2px solid rgba(239,68,68,0.4)" }}>
                            <StopCircleIcon sx={{ fontSize: 44, color: "#ef4444" }} />
                        </Box>
                        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Class Has Ended</Typography>
                        <Typography sx={{ color: "#94a3b8", mb: 1 }}>
                            This live class was ended by <strong style={{ color: "#f1f5f9" }}>{classEndedInfo?.endedBy}</strong>.
                        </Typography>
                        {classEndedInfo?.endedAt && (
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                Ended at: {new Date(classEndedInfo.endedAt).toLocaleTimeString()}
                            </Typography>
                        )}
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(currentRole === "Teacher" ? "/Teacher/dashboard" : "/Student/dashboard")}
                        sx={{ borderRadius: "14px", fontWeight: 700, px: 4, py: 1.5, background: "linear-gradient(135deg, #2563eb, #7c3aed)", textTransform: "none", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}
                    >
                        Return to Dashboard
                    </Button>
                </Box>
            </Box>
        );
    }

    // ─────────────────────────────────────────────────────────────
    //  MEETING ROOM UI
    // ─────────────────────────────────────────────────────────────
    return (
        <Box sx={{ width: "100%", height: "100vh", background: "#0a0f1a", color: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* ── TOP BAR ────────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5, background: "rgba(15,23,42,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.2)", flexShrink: 0, zIndex: 10 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {hasJoined && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <RecordIcon sx={{ color: "#ef4444", fontSize: 14, animation: "pulse 1.5s infinite" }} />
                            <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 700, letterSpacing: 1 }}>LIVE</Typography>
                        </Box>
                    )}
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.12)", height: 28, alignSelf: "center" }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2, letterSpacing: 0.5 }}>
                            {roomId}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {currentUser.name} · {currentRole} {hasJoined ? `· ${formatDuration(duration)}` : "· Connecting..."}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Chip
                        label={`${totalParticipants} participant${totalParticipants !== 1 ? "s" : ""}`}
                        size="small"
                        sx={{ bgcolor: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", fontWeight: 600 }}
                    />
                </Box>
            </Box>

            {/* ── MAIN AREA ───────────────────────────────────────── */}
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

                {/* ── VIDEO GRID ─────────────────────────────────── */}
                <Box sx={{ flex: 1, p: 2, overflow: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
                    {isConnecting ? (
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
                            <CircularProgress size={64} thickness={3} sx={{ color: "#6366f1" }} />
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h6" fontWeight={700}>Connecting to classroom...</Typography>
                                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>Setting up camera and microphone</Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ display: "grid", gap: 2, height: "100%", gridTemplateColumns: peers.filter(p => p.stream).length > 0 ? "1fr 1fr" : "1fr", gridTemplateRows: peers.filter(p => p.stream).length > 2 ? "1fr 1fr" : "1fr", "@media (max-width: 600px)": { gridTemplateColumns: "1fr" } }}>

                            {/* ── LOCAL VIDEO ──────────────────── */}
                            <LocalVideoTile
                                videoRef={localVideoRef}
                                name={currentUser.name}
                                role={currentRole}
                                isMuted={isMuted}
                                isVideoOff={isVideoOff}
                                isScreenSharing={isScreenSharing}
                                stream={localStream}
                            />

                            {/* ── REMOTE VIDEOS ────────────────── */}
                            {peers.map((peer) => (
                                <RemoteVideoTile key={peer.socketId} peer={peer} />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* ── SIDE PANEL ─────────────────────────────────── */}
                {sidePanel && (
                    <Box sx={{ width: 320, flexShrink: 0, background: "rgba(15,23,42,0.99)", borderLeft: "1px solid rgba(99,102,241,0.15)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        {/* Panel Header */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            <Typography fontWeight={700} sx={{ fontSize: 15 }}>
                                {sidePanel === "chat" ? "💬 Class Chat" : "👥 Participants"}
                            </Typography>
                            <IconButton size="small" onClick={() => setSidePanel(null)} sx={{ color: "#475569", "&:hover": { color: "#94a3b8" } }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Chat Panel */}
                        {sidePanel === "chat" && (
                            <>
                                <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {chatMessages.length === 0 && (
                                        <Box sx={{ textAlign: "center", py: 6, color: "#334155" }}>
                                            <ChatIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
                                            <Typography variant="body2">No messages yet.</Typography>
                                        </Box>
                                    )}
                                    {chatMessages.map((msg, i) => {
                                        const isMe = msg.sender === currentUser.name;
                                        return (
                                            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                                                <Typography variant="caption" sx={{ color: "#475569", mb: 0.4 }}>
                                                    {isMe ? "You" : msg.sender} · {msg.time}
                                                </Typography>
                                                <Box sx={{ bgcolor: isMe ? "#4f46e5" : "#1e293b", px: 2, py: 1, borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", maxWidth: "88%", border: isMe ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
                                                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </Box>
                                <Box sx={{ px: 2, pb: 2, pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 1 }}>
                                    <TextField
                                        fullWidth size="small"
                                        placeholder="Type a message..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendChat()}
                                        sx={{
                                            "& .MuiOutlinedInput-root": { borderRadius: "14px", color: "#f1f5f9", bgcolor: "#1e293b", "& fieldset": { borderColor: "transparent" }, "&:hover fieldset": { borderColor: "rgba(99,102,241,0.4)" }, "&.Mui-focused fieldset": { borderColor: "#6366f1" } },
                                            "& .MuiInputBase-input::placeholder": { color: "#475569", opacity: 1 }
                                        }}
                                    />
                                    <IconButton onClick={sendChat} sx={{ bgcolor: "#4f46e5", color: "#fff", "&:hover": { bgcolor: "#4338ca" }, borderRadius: "14px", width: 42, height: 42, flexShrink: 0 }}>
                                        <SendIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                            </>
                        )}

                        {/* People Panel */}
                        {sidePanel === "people" && (
                            <List sx={{ flex: 1, overflowY: "auto", py: 1 }}>
                                {/* Self */}
                                <ListItem sx={{ px: 2, py: 1, borderRadius: "10px", mx: 1, width: "auto", "&:hover": { bgcolor: "rgba(99,102,241,0.08)" } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "#4f46e5", width: 38, height: 38, fontSize: 15, fontWeight: 700 }}>
                                            {currentUser.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${currentUser.name} (You)`}
                                        secondary={currentRole}
                                        primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}
                                        secondaryTypographyProps={{ fontSize: 12, color: "#4f46e5" }}
                                    />
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e", flexShrink: 0 }} />
                                </ListItem>
                                <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 0.5, mx: 2 }} />
                                {peers.length === 0 && (
                                    <Box sx={{ textAlign: "center", py: 4, color: "#334155" }}>
                                        <Typography variant="body2">Waiting for others to join...</Typography>
                                    </Box>
                                )}
                                {peers.map((peer) => (
                                    <ListItem key={peer.socketId} sx={{ px: 2, py: 1, borderRadius: "10px", mx: 1, width: "auto", "&:hover": { bgcolor: "rgba(99,102,241,0.08)" } }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: peer.role === "Teacher" ? "#7c3aed" : "#1e293b", border: "1px solid rgba(255,255,255,0.1)", width: 38, height: 38, fontSize: 15, fontWeight: 700 }}>
                                                {peer.userName?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={peer.userName}
                                            secondary={peer.role}
                                            primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}
                                            secondaryTypographyProps={{ fontSize: 12, color: "#64748b" }}
                                        />
                                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: peer.stream ? "#22c55e" : "#f59e0b", flexShrink: 0 }} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </Box>

            {/* ── CONTROL BAR ─────────────────────────────────────── */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, py: 2.5, px: 2, background: "rgba(15,23,42,0.97)", borderTop: "1px solid rgba(99,102,241,0.15)", flexShrink: 0, flexWrap: "wrap" }}>

                <Tooltip title={isMuted ? "Unmute" : "Mute mic"} arrow>
                    <IconButton onClick={toggleMute} sx={{ bgcolor: isMuted ? "#ef4444" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: isMuted ? "#ef4444" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: isMuted ? "#dc2626" : "#334155" }, transition: "all 0.2s" }}>
                        {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={isVideoOff ? "Start video" : "Stop video"} arrow>
                    <IconButton onClick={toggleVideo} sx={{ bgcolor: isVideoOff ? "#ef4444" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: isVideoOff ? "#ef4444" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: isVideoOff ? "#dc2626" : "#334155" }, transition: "all 0.2s" }}>
                        {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"} arrow>
                    <IconButton onClick={toggleScreenShare} sx={{ bgcolor: isScreenSharing ? "#059669" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: isScreenSharing ? "#059669" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: isScreenSharing ? "#047857" : "#334155" }, transition: "all 0.2s" }}>
                        {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Participants" arrow>
                    <IconButton onClick={() => openPanel("people")} sx={{ bgcolor: sidePanel === "people" ? "#4f46e5" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: sidePanel === "people" ? "#4f46e5" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: sidePanel === "people" ? "#4338ca" : "#334155" }, transition: "all 0.2s" }}>
                        <Badge badgeContent={totalParticipants} sx={{ "& .MuiBadge-badge": { bgcolor: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 700 } }}>
                            <PeopleIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Chat" arrow>
                    <IconButton onClick={() => openPanel("chat")} sx={{ bgcolor: sidePanel === "chat" ? "#4f46e5" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: sidePanel === "chat" ? "#4f46e5" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: sidePanel === "chat" ? "#4338ca" : "#334155" }, transition: "all 0.2s" }}>
                        <Badge badgeContent={unreadChat} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
                            <ChatIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Separator */}
                <Box sx={{ width: 1, height: 44, bgcolor: "rgba(255,255,255,0.08)", borderRadius: "2px", mx: 0.5 }} />

                {/* End Class button (Teacher / Admin only) */}
                {canEndClass && (
                    <Tooltip title="End class for everyone" arrow>
                        <Button
                            variant="outlined"
                            startIcon={<StopCircleIcon />}
                            onClick={() => setShowEndConfirm(true)}
                            sx={{ borderColor: "#f97316", color: "#f97316", borderRadius: "14px", fontWeight: 700, textTransform: "none", px: 2.5, py: 1.2, "&:hover": { bgcolor: "rgba(249,115,22,0.12)", borderColor: "#ea580c" } }}
                        >
                            End Class
                        </Button>
                    </Tooltip>
                )}

                {/* Leave Class (everyone) */}
                <Button
                    variant="contained"
                    startIcon={<CallEndIcon />}
                    onClick={leaveMeeting}
                    sx={{ bgcolor: "#ef4444", color: "#fff", px: 2.5, py: 1.2, borderRadius: "14px", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#dc2626" }, boxShadow: "0 4px 15px rgba(239,68,68,0.35)" }}
                >
                    Leave
                </Button>
            </Box>

            {/* ── PASSWORD MODAL ───────────────────────────────────── */}
            <Dialog open={isPasswordModalOpen} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", background: "#0f172a", border: "1px solid rgba(99,102,241,0.2)", color: "#fff" } }}>
                <DialogTitle sx={{ fontWeight: 800, pt: 3, pb: 0.5, fontSize: 20 }}>
                    🔐 Enter Class Password
                </DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ color: "#64748b", mb: 2.5 }}>
                        Ask your teacher for the meeting password or PIN to join.
                    </Typography>
                    <TextField
                        fullWidth type="password"
                        label="Password / PIN"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                        error={!!joinError}
                        helperText={joinError}
                        autoFocus
                        sx={{
                            "& .MuiOutlinedInput-root": { color: "#fff", borderRadius: "12px", "& fieldset": { borderColor: "rgba(99,102,241,0.3)" }, "&:hover fieldset": { borderColor: "#6366f1" }, "&.Mui-focused fieldset": { borderColor: "#6366f1" } },
                            "& .MuiInputLabel-root": { color: "#64748b" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => navigate(-1)} sx={{ color: "#64748b", fontWeight: 600, borderRadius: "10px" }}>Cancel</Button>
                    <Button
                        onClick={handlePasswordSubmit}
                        variant="contained"
                        sx={{ bgcolor: "#4f46e5", fontWeight: 700, borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#4338ca" } }}
                    >
                        Join Class
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── END CLASS CONFIRM ────────────────────────────────── */}
            <Dialog open={showEndConfirm} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", background: "#0f172a", border: "1px solid rgba(239,68,68,0.2)", color: "#fff" } }}>
                <DialogTitle sx={{ fontWeight: 800, pt: 3, pb: 0.5, fontSize: 20, color: "#f87171" }}>
                    ⚠️ End Class for Everyone?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        This will immediately disconnect all <strong style={{ color: "#f1f5f9" }}>{totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}</strong> from the class. This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setShowEndConfirm(false)} sx={{ color: "#64748b", fontWeight: 600, borderRadius: "10px" }}>Cancel</Button>
                    <Button
                        onClick={confirmEndClass}
                        variant="contained"
                        startIcon={<StopCircleIcon />}
                        sx={{ bgcolor: "#ef4444", fontWeight: 700, borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#dc2626" } }}
                    >
                        Yes, End Class
                    </Button>
                </DialogActions>
            </Dialog>

            <style>{`
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
                video { display: block; }
            `}</style>
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Local Video Tile
// ─────────────────────────────────────────────────────────────────────────────
const LocalVideoTile = ({ videoRef, name, role, isMuted, isVideoOff, isScreenSharing, stream }) => {
    // Ensure srcObject is always in sync
    useEffect(() => {
        if (videoRef?.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    return (
        <Box sx={{ position: "relative", bgcolor: "#060d1a", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(99,102,241,0.35)", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { borderColor: "rgba(99,102,241,0.65)" }, transition: "border-color 0.2s" }}>
            {/* Always keep video element mounted but show avatar overlay if video off */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transform: !isScreenSharing ? "scaleX(-1)" : "none",
                    display: isVideoOff ? "none" : "block",
                    position: "absolute", inset: 0
                }}
            />
            {isVideoOff && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, zIndex: 1 }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: 32, fontWeight: 800, bgcolor: "#4f46e5", border: "3px solid rgba(99,102,241,0.4)" }}>
                        {name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>Camera off</Typography>
                </Box>
            )}
            {/* Name label */}
            <Box sx={{ position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 0.8, bgcolor: "rgba(0,0,0,0.6)", px: 1.5, py: 0.5, borderRadius: "8px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                {isMuted && <MicOffIcon sx={{ fontSize: 13, color: "#ef4444" }} />}
                <Typography variant="caption" fontWeight={700}>{name} (You)</Typography>
            </Box>
            {/* Role badge */}
            <Box sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(79,70,229,0.75)", px: 1.5, py: 0.3, borderRadius: "6px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#c7d2fe" }}>{role}</Typography>
            </Box>
            {isScreenSharing && (
                <Box sx={{ position: "absolute", top: 10, left: 10, bgcolor: "rgba(5,150,105,0.85)", px: 1.5, py: 0.3, borderRadius: "6px", zIndex: 2 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700 }}>📺 SHARING</Typography>
                </Box>
            )}
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Remote Video Tile
// ─────────────────────────────────────────────────────────────────────────────
const RemoteVideoTile = ({ peer }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && peer.stream) {
            videoRef.current.srcObject = peer.stream;
            videoRef.current.play().catch(() => {});
        }
    }, [peer.stream]);

    return (
        <Box sx={{ position: "relative", bgcolor: "#060d1a", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(99,102,241,0.2)", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { borderColor: "rgba(99,102,241,0.5)" }, transition: "border-color 0.2s" }}>
            {(!peer.stream || peer.isVideoOff) ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#475569", zIndex: 1 }}>
                    <Avatar sx={{ width: 70, height: 70, fontSize: 28, fontWeight: 800, bgcolor: "#1e293b", border: "2px solid rgba(255,255,255,0.08)" }}>
                        {peer.userName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {!peer.stream ? (
                            <>
                                <CircularProgress size={14} thickness={4} sx={{ color: "#4f46e5" }} />
                                <Typography variant="caption">Connecting {peer.userName}...</Typography>
                            </>
                        ) : (
                            <Typography variant="caption" sx={{ color: "#64748b" }}>Camera off</Typography>
                        )}
                    </Box>
                </Box>
            ) : null}

            {peer.stream && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ 
                        width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0,
                        display: peer.isVideoOff ? "none" : "block"
                    }}
                />
            )}
            {/* Name label */}
            <Box sx={{ position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 0.8, bgcolor: "rgba(0,0,0,0.6)", px: 1.5, py: 0.5, borderRadius: "8px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                {peer.isMuted && <MicOffIcon sx={{ fontSize: 13, color: "#ef4444" }} />}
                <Typography variant="caption" fontWeight={700}>{peer.userName}</Typography>
            </Box>
            {/* Role badge */}
            <Box sx={{ position: "absolute", top: 10, right: 10, bgcolor: peer.role === "Teacher" ? "rgba(124,58,237,0.75)" : "rgba(30,41,59,0.8)", px: 1.5, py: 0.3, borderRadius: "6px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: peer.role === "Teacher" ? "#ddd6fe" : "#94a3b8" }}>{peer.role}</Typography>
            </Box>
        </Box>
    );
};

export default MeetingRoom;
