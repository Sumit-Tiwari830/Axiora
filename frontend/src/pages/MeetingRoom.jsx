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
    Tooltip,
    Switch,
    FormControlLabel
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
    StopCircle as StopCircleIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    VolumeOff as VolumeOffIcon,
    VolumeUp as VolumeUpIcon,
    AdminPanelSettings as ModeratorIcon
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
    const allowVoiceParam = searchParams.get("allowVoice") !== "false";
    const allowVideoParam = searchParams.get("allowVideo") !== "false";

    // ── Auth ─────────────────────────────────────────────────────
    const [passwordInput, setPasswordInput] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(!initialPass);
    const [joinError, setJoinError] = useState("");
    const [hasJoined, setHasJoined] = useState(false);

    // ── Media ────────────────────────────────────────────────────
    const [localStream, setLocalStream] = useState(null);
    const [peers, setPeers] = useState([]); // [{ socketId, userName, role, stream, isMuted, isVideoOff }]
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // ── Moderation Settings & Permissions ────────────────────────
    const [allowClassVoice, setAllowClassVoice] = useState(allowVoiceParam);
    const [allowClassVideo, setAllowClassVideo] = useState(allowVideoParam);
    const [presenters, setPresenters] = useState([]); // array of socketIds
    const [roomPermissions, setRoomPermissions] = useState({});

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
    const mySocketIdRef = useRef(null);     // track my own socketId

    const isTeacherOrAdmin = currentRole === "Teacher" || currentRole === "Admin";

    // ── Derived: am I a presenter? ───────────────────────────────
    const amPresenter = presenters.includes(mySocketIdRef.current);

    // ── Moderation Locks (for students only) ─────────────────────
    const myPermissions = roomPermissions[mySocketIdRef.current] || {};
    const isVoiceLocked = !isTeacherOrAdmin && !allowClassVoice && !myPermissions.voiceAllowed;
    const isVideoLocked = !isTeacherOrAdmin && !allowClassVideo && !myPermissions.videoAllowed;

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

    // Auto-enforce voice lock
    useEffect(() => {
        if (isVoiceLocked && !isMuted) {
            const track = localStreamRef.current?.getAudioTracks()[0];
            if (track) track.enabled = false;
            setIsMuted(true);
            socketRef.current?.emit("toggle-mute", { roomId, isMuted: true });
        }
    }, [isVoiceLocked, isMuted, roomId]);

    // Auto-enforce video lock
    useEffect(() => {
        if (isVideoLocked && !isVideoOff) {
            const track = localStreamRef.current?.getVideoTracks()[0];
            if (track) track.enabled = false;
            setIsVideoOff(true);
            socketRef.current?.emit("toggle-video", { roomId, isVideoOff: true });
        }
    }, [isVideoLocked, isVideoOff, roomId]);

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
    // KEY FIX: We always pass the CURRENT localStream explicitly to ensure
    // tracks are added at the time of PC creation, not captured in a closure.
    const createPC = useCallback((socketId, userName, role, currentStream) => {
        if (peerConnections.current[socketId]) {
            return peerConnections.current[socketId];
        }

        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnections.current[socketId] = pc;

        // ─── CRITICAL FIX: Add all tracks from the stream to this connection ───
        // We use the passed `currentStream` arg (not a stale closure) so the
        // teacher's audio/video tracks are always included.
        const stream = currentStream || localStreamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => {
                console.log(`[WebRTC] Adding ${track.kind} track to PC for ${userName}`);
                pc.addTrack(track, stream);
            });
        } else {
            console.warn("[WebRTC] No local stream available when creating PC for", userName);
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
            console.log(`[WebRTC] Received remote ${event.track.kind} track from ${userName}`);
            const remoteStream = event.streams[0];
            if (!remoteStream) return;
            setPeers((prev) => {
                const existing = prev.find((p) => p.socketId === socketId);
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

        // ─── CRITICAL FIX: Acquire stream FIRST, store in ref ───────
        const stream = await startLocalStream();
        if (!stream) {
            setIsConnecting(false);
            return;
        }
        // Ensure ref is set immediately (startLocalStream also does this but be explicit)
        localStreamRef.current = stream;

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
            mySocketIdRef.current = socket.id;
            socket.emit("join-room", {
                roomId,
                password: passVal,
                userId: currentUser._id,
                userName: currentUser.name,
                role: currentRole,
                isMuted: false,
                isVideoOff: false,
                allowVoice: allowVoiceParam,
                allowVideo: allowVideoParam
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
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            Object.values(peerConnections.current).forEach((pc) => pc.close());
            peerConnections.current = {};
            setPeers([]);
        });

        // ── Existing users in room → I create offer to each ────
        socket.on("all-users", (users) => {
            console.log("[Socket] Existing users:", users.length);
            setHasJoined(true);
            setIsConnecting(false);

            // ─── Use the stream captured in this closure ────────
            const currentStream = localStreamRef.current;

            users.forEach(async (user) => {
                // Pass currentStream explicitly so audio/video tracks are included
                const pc = createPC(user.socketId, user.userName, user.role, currentStream);
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

            if (users.length === 0) {
                console.log("[Meeting] Waiting for others to join...");
            }
        });

        // ── Signaling: receive offer / answer / candidate ───────
        socket.on("signal", async ({ from, signal, fromUserName, fromRole }) => {
            const currentStream = localStreamRef.current;

            if (signal.type === "offer") {
                let pc = peerConnections.current[from];
                if (!pc) {
                    // Pass currentStream explicitly here too
                    pc = createPC(from, fromUserName || "Peer", fromRole || "Student", currentStream);
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

        // ── Room lock settings & permissions ────────────────────
        socket.on("room-state", ({ allowClassVoice, allowClassVideo, presenters, permissions }) => {
            setAllowClassVoice(allowClassVoice);
            setAllowClassVideo(allowClassVideo);
            setPresenters(presenters);
            setRoomPermissions(permissions);
        });

        socket.on("room-state-updated", ({ allowClassVoice, allowClassVideo, presenters, permissions }) => {
            setAllowClassVoice(allowClassVoice);
            setAllowClassVideo(allowClassVideo);
            setPresenters(presenters);
            setRoomPermissions(permissions);
        });

        // ── Force disable media ─────────────────────────────────
        socket.on("force-disable-media", ({ type }) => {
            if (type === "voice") {
                const track = localStreamRef.current?.getAudioTracks()[0];
                if (track) track.enabled = false;
                setIsMuted(true);
                socketRef.current?.emit("toggle-mute", { roomId, isMuted: true });
            } else if (type === "video") {
                const track = localStreamRef.current?.getVideoTracks()[0];
                if (track) track.enabled = false;
                setIsVideoOff(true);
                socketRef.current?.emit("toggle-video", { roomId, isVideoOff: true });
            }
        });

        // ── Force mute from teacher ─────────────────────────────
        socket.on("force-mute", () => {
            const track = localStreamRef.current?.getAudioTracks()[0];
            if (track) track.enabled = false;
            setIsMuted(true);
            socketRef.current?.emit("toggle-mute", { roomId, isMuted: true });
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

    }, [roomId, currentUser, currentRole, createPC, allowVoiceParam, allowVideoParam]);

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
        if (isVoiceLocked) return; // locked by teacher
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
        if (isVideoLocked) return; // locked by teacher
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

    // ── Teacher: toggle class audio lock ──────────────────────────
    const toggleClassAudioLock = () => {
        const newLocked = allowClassVoice; // if currently allowed, we lock it
        socketRef.current?.emit("toggle-class-audio-lock", { roomId, locked: newLocked });
    };

    // ── Teacher: toggle class video lock ──────────────────────────
    const toggleClassVideoLock = () => {
        const newLocked = allowClassVideo;
        socketRef.current?.emit("toggle-class-video-lock", { roomId, locked: newLocked });
    };

    // ── Teacher: force mute a peer ────────────────────────────────
    const forceMutePeer = (targetSocketId) => {
        socketRef.current?.emit("force-mute-peer", { roomId, targetSocketId });
    };

    // ── Teacher: grant/revoke voice permission for a peer ─────────
    const togglePeerVoicePermission = (targetSocketId) => {
        const current = roomPermissions[targetSocketId]?.voiceAllowed || false;
        socketRef.current?.emit("grant-peer-permission", {
            roomId,
            targetSocketId,
            type: "voice",
            allowed: !current
        });
    };

    // ── Teacher: grant/revoke video permission for a peer ─────────
    const togglePeerVideoPermission = (targetSocketId) => {
        const current = roomPermissions[targetSocketId]?.videoAllowed || false;
        socketRef.current?.emit("grant-peer-permission", {
            roomId,
            targetSocketId,
            type: "video",
            allowed: !current
        });
    };

    // ── Teacher: toggle presenter status for a peer ───────────────
    const togglePresenter = (targetSocketId) => {
        const isCurrentlyPresenter = presenters.includes(targetSocketId);
        socketRef.current?.emit("toggle-presenter", {
            roomId,
            targetSocketId,
            presenting: !isCurrentlyPresenter
        });
    };

    // ── Layout logic ──────────────────────────────────────────────
    // Presenter peers (their tiles go to main area)
    // Non-presenter peers go to sidebar strip
    const presenterPeers = peers.filter(p => presenters.includes(p.socketId));
    const sidebarPeers = peers.filter(p => !presenters.includes(p.socketId));

    // Who shows in the main video area:
    // - If I am a presenter, show my local + presenter peers
    // - If there are NO presenters, show everyone (normal grid)
    const hasActivePresenters = presenters.length > 0;

    const totalParticipants = 1 + peers.length;
    const canEndClass = isTeacherOrAdmin;

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
                        sx={{ borderRadius: "14px", fontWeight: 700, px: 4, py: 1.5, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", textTransform: "none", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}
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
                    {/* Lock indicators for students */}
                    {!isTeacherOrAdmin && (
                        <>
                            {!allowClassVoice && !myPermissions.voiceAllowed && (
                                <Chip icon={<MicOffIcon sx={{ fontSize: 14 }} />} label="Mic Locked" size="small"
                                    sx={{ bgcolor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", fontWeight: 600 }} />
                            )}
                            {!allowClassVideo && !myPermissions.videoAllowed && (
                                <Chip icon={<VideocamOffIcon sx={{ fontSize: 14 }} />} label="Camera Locked" size="small"
                                    sx={{ bgcolor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", fontWeight: 600 }} />
                            )}
                        </>
                    )}
                    <Chip
                        label={`${totalParticipants} participant${totalParticipants !== 1 ? "s" : ""}`}
                        size="small"
                        sx={{ bgcolor: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", fontWeight: 600 }}
                    />
                </Box>
            </Box>

            {/* ── MAIN AREA ───────────────────────────────────────── */}
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

                {/* ── VIDEO AREA ─────────────────────────────────── */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
                    {isConnecting ? (
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 3 }}>
                            <CircularProgress size={64} thickness={3} sx={{ color: "#6366f1" }} />
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h6" fontWeight={700}>Connecting to classroom...</Typography>
                                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>Setting up camera and microphone</Typography>
                            </Box>
                        </Box>
                    ) : hasActivePresenters ? (
                        /* ── PRESENTER LAYOUT ────────────────────── */
                        <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
                            {/* Big screen area */}
                            <Box sx={{ flex: 1, p: 1.5, display: "grid", gap: 1.5, overflow: "hidden",
                                gridTemplateColumns: presenterPeers.length + (amPresenter ? 1 : 0) >= 2 ? "1fr 1fr" : "1fr",
                                gridTemplateRows: "1fr"
                            }}>
                                {/* Teacher/presenter local tile (if I am a presenter) */}
                                {amPresenter && (
                                    <LocalVideoTile
                                        videoRef={localVideoRef}
                                        name={currentUser.name}
                                        role={currentRole}
                                        isMuted={isMuted}
                                        isVideoOff={isVideoOff}
                                        isScreenSharing={isScreenSharing}
                                        stream={localStream}
                                        isPresenter={true}
                                    />
                                )}
                                {/* Presenter peer tiles */}
                                {presenterPeers.map((peer) => (
                                    <RemoteVideoTile key={peer.socketId} peer={peer} isPresenter={true} />
                                ))}
                            </Box>

                            {/* Participant strip (right sidebar) */}
                            <Box sx={{ width: 180, flexShrink: 0, background: "rgba(15,23,42,0.98)", borderLeft: "1px solid rgba(99,102,241,0.12)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
                                <Typography variant="caption" sx={{ color: "#475569", px: 1, pt: 0.5, fontWeight: 700, letterSpacing: 0.5 }}>
                                    PARTICIPANTS
                                </Typography>
                                {/* My local tile (small) if I'm not a presenter */}
                                {!amPresenter && (
                                    <LocalVideoTile
                                        videoRef={localVideoRef}
                                        name={currentUser.name}
                                        role={currentRole}
                                        isMuted={isMuted}
                                        isVideoOff={isVideoOff}
                                        isScreenSharing={isScreenSharing}
                                        stream={localStream}
                                        isPresenter={false}
                                        compact={true}
                                    />
                                )}
                                {sidebarPeers.map((peer) => (
                                    <RemoteVideoTile key={peer.socketId} peer={peer} isPresenter={false} compact={true} />
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        /* ── NORMAL GRID LAYOUT ──────────────────── */
                        <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
                            <Box sx={{
                                display: "grid", gap: 2, height: "100%",
                                gridTemplateColumns: peers.length === 0 ? "1fr" : peers.length === 1 ? "1fr 1fr" : peers.length <= 3 ? "1fr 1fr" : "1fr 1fr 1fr",
                                gridTemplateRows: peers.length <= 1 ? "1fr" : "1fr 1fr",
                                "@media (max-width: 600px)": { gridTemplateColumns: "1fr" }
                            }}>
                                <LocalVideoTile
                                    videoRef={localVideoRef}
                                    name={currentUser.name}
                                    role={currentRole}
                                    isMuted={isMuted}
                                    isVideoOff={isVideoOff}
                                    isScreenSharing={isScreenSharing}
                                    stream={localStream}
                                    isPresenter={false}
                                />
                                {peers.map((peer) => (
                                    <RemoteVideoTile key={peer.socketId} peer={peer} isPresenter={false} />
                                ))}
                            </Box>
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
                                            <Typography variant="body2">No messages yet. Say hello!</Typography>
                                        </Box>
                                    )}
                                    {chatMessages.map((msg, i) => {
                                        const isMe = msg.sender === currentUser.name;
                                        const isTeacher = msg.role === "Teacher" || msg.role === "Admin";
                                        return (
                                            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                                                {/* Sender name + time */}
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.4 }}>
                                                    {!isMe && (
                                                        <Avatar sx={{
                                                            width: 18, height: 18, fontSize: 10, fontWeight: 700,
                                                            bgcolor: isTeacher ? "#7c3aed" : "#1e293b",
                                                            border: "1px solid rgba(255,255,255,0.1)"
                                                        }}>
                                                            {msg.sender?.[0]?.toUpperCase()}
                                                        </Avatar>
                                                    )}
                                                    <Typography variant="caption" sx={{ color: isTeacher && !isMe ? "#a78bfa" : "#475569", fontWeight: isTeacher ? 700 : 400 }}>
                                                        {isMe ? "You" : msg.sender}
                                                        {isTeacher && !isMe ? " · 👨‍🏫" : ""}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "#334155", fontSize: 10 }}>
                                                        {msg.time}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    bgcolor: isMe ? "#4f46e5" : isTeacher ? "rgba(124,58,237,0.2)" : "#1e293b",
                                                    px: 2, py: 1,
                                                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                                    maxWidth: "88%",
                                                    border: isMe ? "none" : isTeacher ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.07)"
                                                }}>
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
                            <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                                {/* Teacher moderation controls */}
                                {isTeacherOrAdmin && (
                                    <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.07)", bgcolor: "rgba(99,102,241,0.06)" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                            <ModeratorIcon sx={{ fontSize: 16, color: "#a5b4fc" }} />
                                            <Typography variant="caption" sx={{ color: "#a5b4fc", fontWeight: 700, letterSpacing: 0.5 }}>CLASS CONTROLS</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                                    {allowClassVoice ? <MicIcon sx={{ fontSize: 15, color: "#22c55e" }} /> : <MicOffIcon sx={{ fontSize: 15, color: "#ef4444" }} />}
                                                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>Student Microphones</Typography>
                                                </Box>
                                                <Switch
                                                    checked={allowClassVoice}
                                                    onChange={toggleClassAudioLock}
                                                    size="small"
                                                    sx={{
                                                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#22c55e" }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                                    {allowClassVideo ? <VideocamIcon sx={{ fontSize: 15, color: "#22c55e" }} /> : <VideocamOffIcon sx={{ fontSize: 15, color: "#ef4444" }} />}
                                                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>Student Cameras</Typography>
                                                </Box>
                                                <Switch
                                                    checked={allowClassVideo}
                                                    onChange={toggleClassVideoLock}
                                                    size="small"
                                                    sx={{
                                                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#22c55e" }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                <List sx={{ py: 1, flex: 1 }}>
                                    {/* Self */}
                                    <ListItem sx={{ px: 2, py: 0.8 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "#4f46e5", width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                                                {currentUser.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${currentUser.name} (You)`}
                                            secondary={currentRole}
                                            primaryTypographyProps={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}
                                            secondaryTypographyProps={{ fontSize: 11, color: "#4f46e5" }}
                                        />
                                        {amPresenter && <Chip label="Presenter" size="small" sx={{ bgcolor: "rgba(234,179,8,0.15)", color: "#fbbf24", border: "1px solid rgba(234,179,8,0.3)", fontSize: 10, fontWeight: 700, height: 20 }} />}
                                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e", ml: 1 }} />
                                    </ListItem>
                                    <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 0.5, mx: 2 }} />
                                    {peers.length === 0 && (
                                        <Box sx={{ textAlign: "center", py: 4, color: "#334155" }}>
                                            <Typography variant="body2">Waiting for others to join...</Typography>
                                        </Box>
                                    )}
                                    {peers.map((peer) => {
                                        const peerPermissions = roomPermissions[peer.socketId] || {};
                                        const isPeerPresenter = presenters.includes(peer.socketId);
                                        return (
                                            <ListItem key={peer.socketId} sx={{ px: 2, py: 0.8, flexDirection: "column", alignItems: "stretch" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                                    <Avatar sx={{ bgcolor: peer.role === "Teacher" ? "#7c3aed" : "#1e293b", border: "1px solid rgba(255,255,255,0.1)", width: 36, height: 36, fontSize: 14, fontWeight: 700, mr: 1.5 }}>
                                                        {peer.userName?.[0]?.toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {peer.userName}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 11, color: "#64748b" }}>{peer.role}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        {isPeerPresenter && <Chip label="Presenter" size="small" sx={{ bgcolor: "rgba(234,179,8,0.15)", color: "#fbbf24", border: "1px solid rgba(234,179,8,0.3)", fontSize: 9, fontWeight: 700, height: 18 }} />}
                                                        {peer.isMuted && <MicOffIcon sx={{ fontSize: 13, color: "#ef4444" }} />}
                                                        {peer.isVideoOff && <VideocamOffIcon sx={{ fontSize: 13, color: "#ef4444" }} />}
                                                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: peer.stream ? "#22c55e" : "#f59e0b" }} />
                                                    </Box>
                                                </Box>

                                                {/* Teacher controls for this peer */}
                                                {isTeacherOrAdmin && peer.role !== "Teacher" && peer.role !== "Admin" && (
                                                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.8, pl: 6.5 }}>
                                                        <Tooltip title="Force mute" arrow>
                                                            <IconButton size="small" onClick={() => forceMutePeer(peer.socketId)}
                                                                sx={{ bgcolor: "rgba(239,68,68,0.1)", color: "#f87171", width: 28, height: 28, "&:hover": { bgcolor: "rgba(239,68,68,0.2)" } }}>
                                                                <MicOffIcon sx={{ fontSize: 13 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={peerPermissions.voiceAllowed ? "Revoke mic permission" : "Allow mic"} arrow>
                                                            <IconButton size="small" onClick={() => togglePeerVoicePermission(peer.socketId)}
                                                                sx={{ bgcolor: peerPermissions.voiceAllowed ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)", color: peerPermissions.voiceAllowed ? "#4ade80" : "#64748b", width: 28, height: 28, "&:hover": { bgcolor: "rgba(34,197,94,0.25)" } }}>
                                                                {peerPermissions.voiceAllowed ? <VolumeUpIcon sx={{ fontSize: 13 }} /> : <VolumeOffIcon sx={{ fontSize: 13 }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={peerPermissions.videoAllowed ? "Revoke camera permission" : "Allow camera"} arrow>
                                                            <IconButton size="small" onClick={() => togglePeerVideoPermission(peer.socketId)}
                                                                sx={{ bgcolor: peerPermissions.videoAllowed ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)", color: peerPermissions.videoAllowed ? "#4ade80" : "#64748b", width: 28, height: 28, "&:hover": { bgcolor: "rgba(34,197,94,0.25)" } }}>
                                                                {peerPermissions.videoAllowed ? <VideocamIcon sx={{ fontSize: 13 }} /> : <VideocamOffIcon sx={{ fontSize: 13 }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={isPeerPresenter ? "Remove from stage" : "Make presenter"} arrow>
                                                            <IconButton size="small" onClick={() => togglePresenter(peer.socketId)}
                                                                sx={{ bgcolor: isPeerPresenter ? "rgba(234,179,8,0.15)" : "rgba(100,116,139,0.15)", color: isPeerPresenter ? "#fbbf24" : "#64748b", width: 28, height: 28, "&:hover": { bgcolor: "rgba(234,179,8,0.25)" } }}>
                                                                {isPeerPresenter ? <StarIcon sx={{ fontSize: 13 }} /> : <StarBorderIcon sx={{ fontSize: 13 }} />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>

            {/* ── CONTROL BAR ─────────────────────────────────────── */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, py: 2.5, px: 2, background: "rgba(15,23,42,0.97)", borderTop: "1px solid rgba(99,102,241,0.15)", flexShrink: 0, flexWrap: "wrap" }}>

                <Tooltip title={isVoiceLocked ? "Mic locked by teacher" : isMuted ? "Unmute" : "Mute mic"} arrow>
                    <span>
                        <IconButton onClick={toggleMute} disabled={isVoiceLocked}
                            sx={{ bgcolor: isMuted ? "#ef4444" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: isMuted ? "#ef4444" : isVoiceLocked ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: isMuted ? "#dc2626" : "#334155" }, "&.Mui-disabled": { bgcolor: "rgba(239,68,68,0.15)", color: "rgba(255,255,255,0.3)" }, transition: "all 0.2s" }}>
                            {isMuted || isVoiceLocked ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title={isVideoLocked ? "Camera locked by teacher" : isVideoOff ? "Start video" : "Stop video"} arrow>
                    <span>
                        <IconButton onClick={toggleVideo} disabled={isVideoLocked}
                            sx={{ bgcolor: isVideoOff ? "#ef4444" : "#1e293b", color: "#fff", width: 52, height: 52, border: "1px solid", borderColor: isVideoOff ? "#ef4444" : isVideoLocked ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)", "&:hover": { bgcolor: isVideoOff ? "#dc2626" : "#334155" }, "&.Mui-disabled": { bgcolor: "rgba(239,68,68,0.15)", color: "rgba(255,255,255,0.3)" }, transition: "all 0.2s" }}>
                            {isVideoOff || isVideoLocked ? <VideocamOffIcon /> : <VideocamIcon />}
                        </IconButton>
                    </span>
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
const LocalVideoTile = ({ videoRef, name, role, isMuted, isVideoOff, isScreenSharing, stream, isPresenter, compact = false }) => {
    useEffect(() => {
        if (videoRef?.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    const minH = compact ? 110 : 220;

    return (
        <Box sx={{
            position: "relative", bgcolor: "#060d1a", borderRadius: compact ? "10px" : "16px", overflow: "hidden",
            border: isPresenter ? "2px solid rgba(234,179,8,0.6)" : "2px solid rgba(99,102,241,0.35)",
            minHeight: minH, display: "flex", alignItems: "center", justifyContent: "center",
            "&:hover": { borderColor: isPresenter ? "rgba(234,179,8,0.9)" : "rgba(99,102,241,0.65)" },
            transition: "border-color 0.2s", boxShadow: isPresenter ? "0 0 20px rgba(234,179,8,0.15)" : "none"
        }}>
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
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, zIndex: 1 }}>
                    <Avatar sx={{ width: compact ? 44 : 72, height: compact ? 44 : 72, fontSize: compact ? 18 : 30, fontWeight: 800, bgcolor: "#4f46e5", border: "2px solid rgba(99,102,241,0.4)" }}>
                        {name?.[0]?.toUpperCase()}
                    </Avatar>
                    {!compact && <Typography variant="body2" sx={{ color: "#64748b" }}>Camera off</Typography>}
                </Box>
            )}
            <Box sx={{ position: "absolute", bottom: 6, left: 6, display: "flex", alignItems: "center", gap: 0.6, bgcolor: "rgba(0,0,0,0.65)", px: 1, py: 0.3, borderRadius: "6px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                {isMuted && <MicOffIcon sx={{ fontSize: compact ? 11 : 13, color: "#ef4444" }} />}
                <Typography sx={{ fontSize: compact ? 10 : 12, fontWeight: 700 }}>{name} (You)</Typography>
            </Box>
            <Box sx={{ position: "absolute", top: 6, right: 6, bgcolor: "rgba(79,70,229,0.8)", px: 1, py: 0.2, borderRadius: "5px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#c7d2fe" }}>{role}</Typography>
            </Box>
            {isPresenter && (
                <Box sx={{ position: "absolute", top: 6, left: 6, bgcolor: "rgba(234,179,8,0.85)", px: 1, py: 0.2, borderRadius: "5px", zIndex: 2 }}>
                    <Typography sx={{ fontSize: 9, fontWeight: 700 }}>⭐ PRESENTER</Typography>
                </Box>
            )}
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Remote Video Tile
// ─────────────────────────────────────────────────────────────────────────────
const RemoteVideoTile = ({ peer, isPresenter, compact = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && peer.stream) {
            videoRef.current.srcObject = peer.stream;
            videoRef.current.play().catch(() => {});
        }
    }, [peer.stream]);

    const minH = compact ? 110 : 220;

    return (
        <Box sx={{
            position: "relative", bgcolor: "#060d1a", borderRadius: compact ? "10px" : "16px", overflow: "hidden",
            border: isPresenter ? "2px solid rgba(234,179,8,0.5)" : "2px solid rgba(99,102,241,0.2)",
            minHeight: minH, display: "flex", alignItems: "center", justifyContent: "center",
            "&:hover": { borderColor: isPresenter ? "rgba(234,179,8,0.8)" : "rgba(99,102,241,0.5)" },
            transition: "border-color 0.2s", boxShadow: isPresenter ? "0 0 20px rgba(234,179,8,0.1)" : "none"
        }}>
            {(!peer.stream || peer.isVideoOff) && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 0.5 : 1.5, color: "#475569", zIndex: 1 }}>
                    <Avatar sx={{ width: compact ? 40 : 64, height: compact ? 40 : 64, fontSize: compact ? 16 : 26, fontWeight: 800, bgcolor: "#1e293b", border: "2px solid rgba(255,255,255,0.08)" }}>
                        {peer.userName?.[0]?.toUpperCase()}
                    </Avatar>
                    {!compact && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            {!peer.stream ? (
                                <>
                                    <CircularProgress size={12} thickness={4} sx={{ color: "#4f46e5" }} />
                                    <Typography variant="caption">Connecting...</Typography>
                                </>
                            ) : (
                                <Typography variant="caption" sx={{ color: "#64748b" }}>Camera off</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            )}

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

            <Box sx={{ position: "absolute", bottom: 6, left: 6, display: "flex", alignItems: "center", gap: 0.6, bgcolor: "rgba(0,0,0,0.65)", px: 1, py: 0.3, borderRadius: "6px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                {peer.isMuted && <MicOffIcon sx={{ fontSize: compact ? 11 : 13, color: "#ef4444" }} />}
                <Typography sx={{ fontSize: compact ? 10 : 12, fontWeight: 700 }}>{peer.userName}</Typography>
            </Box>
            <Box sx={{ position: "absolute", top: 6, right: 6, bgcolor: peer.role === "Teacher" ? "rgba(124,58,237,0.8)" : "rgba(30,41,59,0.85)", px: 1, py: 0.2, borderRadius: "5px", backdropFilter: "blur(8px)", zIndex: 2 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: peer.role === "Teacher" ? "#ddd6fe" : "#94a3b8" }}>{peer.role}</Typography>
            </Box>
            {isPresenter && (
                <Box sx={{ position: "absolute", top: 6, left: 6, bgcolor: "rgba(234,179,8,0.85)", px: 1, py: 0.2, borderRadius: "5px", zIndex: 2 }}>
                    <Typography sx={{ fontSize: 9, fontWeight: 700 }}>⭐ PRESENTER</Typography>
                </Box>
            )}
        </Box>
    );
};

export default MeetingRoom;
