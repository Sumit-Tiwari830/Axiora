const dns = require('dns');
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const Routes = require("./routes/route");

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/", Routes);

const Meeting = require("./models/meetingSchema");

// ─────────────────────────────────────────────────────────────────
//  Socket.io Real-Time + WebRTC Signaling Server
// ─────────────────────────────────────────────────────────────────
// activeMeetings: roomId → { password, ended, endedAt, endedBy, users: { socketId → { userId, userName, role, isMuted, isVideoOff } } }
const activeMeetings = {};

io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── JOIN ROOM ─────────────────────────────────────────────────
    socket.on("join-room", async ({ roomId, password, userId, userName, role, isMuted, isVideoOff, allowVoice, allowVideo }) => {
        try {
            // Find meeting in database to check persistence state
            let dbMeeting = await Meeting.findOne({ roomId });

            if (dbMeeting && dbMeeting.ended) {
                socket.emit("class-ended", {
                    endedBy: dbMeeting.endedBy,
                    endedAt: dbMeeting.endedAt
                });
                return;
            }

            // Create room in database if it doesn't exist and the user is Teacher/Admin
            const isCreator = role === "Teacher" || role === "Admin";
            if (!dbMeeting) {
                if (!isCreator) {
                    socket.emit("join-error", "This classroom meeting does not exist or has not been started yet.");
                    return;
                }
                dbMeeting = await Meeting.create({
                    roomId,
                    password: password || "",
                    ended: false
                });
            }

            // Create room in-memory structure if it doesn't exist
            if (!activeMeetings[roomId]) {
                activeMeetings[roomId] = {
                    password: dbMeeting.password || "",
                    ended: false,
                    endedAt: null,
                    endedBy: null,
                    users: {},
                    allowClassVoice: true,
                    allowClassVideo: true,
                    presenters: [],
                    permissions: {}
                };
            }

            const room = activeMeetings[roomId];

            // Double check ended in memory
            if (room.ended) {
                socket.emit("class-ended", {
                    endedBy: room.endedBy,
                    endedAt: room.endedAt
                });
                return;
            }

            // If creator, initialize class locks and add to presenters
            if (isCreator) {
                if (typeof allowVoice !== "undefined") room.allowClassVoice = allowVoice;
                if (typeof allowVideo !== "undefined") room.allowClassVideo = allowVideo;
                if (!room.presenters.includes(socket.id)) {
                    room.presenters.push(socket.id);
                }
            }

            // Set user permissions
            room.permissions[socket.id] = {
                voiceAllowed: isCreator ? true : false,
                videoAllowed: isCreator ? true : false
            };

            // Validate password (students only — teacher/admin bypasses)
            if (room.password && room.password !== password && !isCreator) {
                socket.emit("join-error", "Invalid meeting password. Please check and try again.");
                return;
            }

            // Register user in room
            room.users[socket.id] = { 
                userId, 
                userName, 
                role, 
                isMuted: isMuted || false, 
                isVideoOff: isVideoOff || false 
            };
            socket.join(roomId);
            console.log(`[Meeting] ${userName} (${role}) joined room ${roomId}`);

            // Send initial room state to joining user
            socket.emit("room-state", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });

            // Tell existing members that someone new joined
            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                userId,
                userName,
                role,
                isMuted: isMuted || false,
                isVideoOff: isVideoOff || false
            });

            // Send existing participants list to the new joiner (so they can offer)
            const existingUsers = Object.keys(room.users)
                .filter((id) => id !== socket.id)
                .map((id) => ({
                    socketId: id,
                    ...room.users[id]
                }));

            socket.emit("all-users", existingUsers);

            // Broadcast updated state to room
            io.to(roomId).emit("room-state-updated", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });
        } catch (err) {
            console.error("Error in join-room socket handler:", err);
            socket.emit("join-error", "An internal server error occurred while joining.");
        }
    });

    // ── WebRTC SIGNALING (Offer / Answer / ICE Candidate) ─────────
    socket.on("signal", ({ to, signal }) => {
        // Attach sender identity so receiver can create a named peer connection
        let fromUserName = "Peer";
        let fromRole = "Student";
        for (const rid in activeMeetings) {
            if (activeMeetings[rid].users[socket.id]) {
                fromUserName = activeMeetings[rid].users[socket.id].userName;
                fromRole = activeMeetings[rid].users[socket.id].role;
                break;
            }
        }
        io.to(to).emit("signal", { from: socket.id, signal, fromUserName, fromRole });
    });

    // ── SEND MEETING INVITATION ───────────────────────────────────
    socket.on("send-meeting-invite", ({ targetStudentIds, classId, meetingDetails }) => {
        io.emit("receive-meeting-invite", { targetStudentIds, classId, meetingDetails });
    });

    // ── IN-ROOM CHAT ──────────────────────────────────────────────
    socket.on("chat-message", ({ roomId, sender, role, text, time }) => {
        socket.to(roomId).emit("chat-message", { sender, role, text, time });
    });

    // ── MUTE / VIDEO TOGGLE SYNC ──────────────────────────────────
    socket.on("toggle-mute", ({ roomId, isMuted }) => {
        const room = activeMeetings[roomId];
        if (room && room.users[socket.id]) {
            room.users[socket.id].isMuted = isMuted;
            socket.to(roomId).emit("peer-mute-toggle", { socketId: socket.id, isMuted });
        }
    });

    socket.on("toggle-video", ({ roomId, isVideoOff }) => {
        const room = activeMeetings[roomId];
        if (room && room.users[socket.id]) {
            room.users[socket.id].isVideoOff = isVideoOff;
            socket.to(roomId).emit("peer-video-toggle", { socketId: socket.id, isVideoOff });
        }
    });

    // ── CLASS AUDIO LOCK (Teacher/Admin only) ───────────────────────
    socket.on("toggle-class-audio-lock", ({ roomId, locked }) => {
        const room = activeMeetings[roomId];
        if (!room) return;

        const user = room.users[socket.id];
        if (user && (user.role === "Teacher" || user.role === "Admin")) {
            room.allowClassVoice = !locked;
            
            // Broadcast state update
            io.to(roomId).emit("room-state-updated", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });
        }
    });

    // ── CLASS VIDEO LOCK (Teacher/Admin only) ───────────────────────
    socket.on("toggle-class-video-lock", ({ roomId, locked }) => {
        const room = activeMeetings[roomId];
        if (!room) return;

        const user = room.users[socket.id];
        if (user && (user.role === "Teacher" || user.role === "Admin")) {
            room.allowClassVideo = !locked;

            // Broadcast state update
            io.to(roomId).emit("room-state-updated", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });
        }
    });

    // ── GRANT PEER PERMISSION (Teacher/Admin only) ──────────────────
    socket.on("grant-peer-permission", ({ roomId, targetSocketId, type, allowed }) => {
        const room = activeMeetings[roomId];
        if (!room) return;

        const user = room.users[socket.id];
        if (user && (user.role === "Teacher" || user.role === "Admin")) {
            if (!room.permissions[targetSocketId]) {
                room.permissions[targetSocketId] = { voiceAllowed: false, videoAllowed: false };
            }

            if (type === "voice") {
                room.permissions[targetSocketId].voiceAllowed = allowed;
            } else if (type === "video") {
                room.permissions[targetSocketId].videoAllowed = allowed;
            }

            // Force disable media if permission revoked
            if (!allowed) {
                io.to(targetSocketId).emit("force-disable-media", { type });
            }

            // Broadcast state update
            io.to(roomId).emit("room-state-updated", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });
        }
    });

    // ── TOGGLE PRESENTER (Teacher/Admin only) ───────────────────────
    socket.on("toggle-presenter", ({ roomId, targetSocketId, presenting }) => {
        const room = activeMeetings[roomId];
        if (!room) return;

        const user = room.users[socket.id];
        if (user && (user.role === "Teacher" || user.role === "Admin")) {
            if (presenting) {
                if (!room.presenters.includes(targetSocketId)) {
                    room.presenters.push(targetSocketId);
                }
            } else {
                room.presenters = room.presenters.filter(id => id !== targetSocketId);
            }

            // Broadcast state update
            io.to(roomId).emit("room-state-updated", {
                allowClassVoice: room.allowClassVoice,
                allowClassVideo: room.allowClassVideo,
                presenters: room.presenters,
                permissions: room.permissions
            });
        }
    });

    // ── FORCE MUTE PEER (Teacher/Admin only) ────────────────────────
    socket.on("force-mute-peer", ({ roomId, targetSocketId }) => {
        const room = activeMeetings[roomId];
        if (!room) return;

        const user = room.users[socket.id];
        if (user && (user.role === "Teacher" || user.role === "Admin")) {
            io.to(targetSocketId).emit("force-mute");
        }
    });

    // ── END CLASS (Teacher or Admin) ──────────────────────────────
    socket.on("end-class", async ({ roomId }) => {
        try {
            const room = activeMeetings[roomId];
            if (!room) return;

            const user = room.users[socket.id];
            const allowedRoles = ["Teacher", "Admin"];
            if (!user || !allowedRoles.includes(user.role)) {
                socket.emit("error-message", "Only the teacher or admin can end the class.");
                return;
            }

            const endedAt = new Date().toISOString();
            const endedBy = user.userName;

            // Mark ended in MongoDB
            try {
                await Meeting.findOneAndUpdate(
                    { roomId },
                    { ended: true, endedAt, endedBy },
                    { new: true, upsert: true }
                );
            } catch (dbErr) {
                console.error("MongoDB update ended failed:", dbErr);
            }

            // Mark room as ended in memory
            room.ended = true;
            room.endedAt = endedAt;
            room.endedBy = endedBy;

            // Notify ALL participants in the room
            io.to(roomId).emit("class-ended", { endedBy, endedAt });

            console.log(`[Meeting] Class ${roomId} ended by ${endedBy} (updated in MongoDB)`);

            // Schedule cleanup after 30 seconds (give time for all clients to receive event)
            setTimeout(() => {
                delete activeMeetings[roomId];
                console.log(`[Meeting] Cleaned up ended room ${roomId} from memory`);
            }, 30000);
        } catch (err) {
            console.error("Error in end-class handler:", err);
        }
    });

    // ── DISCONNECT ────────────────────────────────────────────────
    socket.on("disconnect", () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);

        for (const roomId in activeMeetings) {
            const room = activeMeetings[roomId];
            if (room.users[socket.id]) {
                const user = room.users[socket.id];
                delete room.users[socket.id];
                if (room.permissions) {
                    delete room.permissions[socket.id];
                }
                if (room.presenters) {
                    room.presenters = room.presenters.filter(id => id !== socket.id);
                }

                // Inform others
                socket.to(roomId).emit("user-left", socket.id);
                console.log(`[Meeting] ${user.userName} left room ${roomId}`);

                // Clean up empty non-ended rooms immediately
                if (!room.ended && Object.keys(room.users).length === 0) {
                    delete activeMeetings[roomId];
                    console.log(`[Meeting] Empty room ${roomId} cleaned up`);
                }
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});