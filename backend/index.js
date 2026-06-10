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

// Socket.io Real-Time and WebRTC Signaling Server
const activeMeetings = {}; // maps roomId -> { password, users: { socketId: { userId, userName, role } } }

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room event
    socket.on("join-room", ({ roomId, password, userId, userName, role }) => {
        // Find or create meeting room
        if (!activeMeetings[roomId]) {
            activeMeetings[roomId] = {
                password: password || "",
                users: {}
            };
        }

        const room = activeMeetings[roomId];

        // Validate password (if set and not empty, and user is not teacher)
        if (room.password && room.password !== password && role !== "Teacher") {
            socket.emit("join-error", "Invalid meeting password.");
            return;
        }

        // Add user to the active meeting room
        room.users[socket.id] = { userId, userName, role };
        socket.join(roomId);
        console.log(`User ${userName} (${role}) joined room ${roomId}`);

        // Notify other users in the room
        socket.to(roomId).emit("user-joined", {
            socketId: socket.id,
            userId,
            userName,
            role
        });

        // Send list of all existing users in room to the newly joined user
        const existingUsers = Object.keys(room.users)
            .filter((id) => id !== socket.id)
            .map((id) => ({
                socketId: id,
                ...room.users[id]
            }));

        socket.emit("all-users", existingUsers);
    });

    // Relay WebRTC Signal: Offer, Answer, ICE Candidates
    // Also pass sender's userName and role so receivers can identify the peer
    socket.on("signal", ({ to, signal }) => {
        // Find sender info from active meetings
        let fromUserName = "Peer";
        let fromRole = "Student";
        for (const roomId in activeMeetings) {
            if (activeMeetings[roomId].users[socket.id]) {
                fromUserName = activeMeetings[roomId].users[socket.id].userName;
                fromRole = activeMeetings[roomId].users[socket.id].role;
                break;
            }
        }
        io.to(to).emit("signal", {
            from: socket.id,
            signal,
            fromUserName,
            fromRole
        });
    });

    // Send Real-Time Meeting Invitation
    socket.on("send-meeting-invite", ({ targetStudentIds, classId, meetingDetails }) => {
        // Broadcast meeting alert to all connected clients
        // Clients will filter by their own userId
        io.emit("receive-meeting-invite", {
            targetStudentIds,
            classId,
            meetingDetails
        });
    });

    // Relay In-Room Chat Messages
    socket.on("chat-message", ({ roomId, sender, role, text, time }) => {
        // Broadcast to everyone else in the room (not the sender)
        socket.to(roomId).emit("chat-message", { sender, role, text, time });
    });

    // Disconnect event
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        // Remove user from any active meetings
        for (const roomId in activeMeetings) {
            const room = activeMeetings[roomId];
            if (room.users[socket.id]) {
                const user = room.users[socket.id];
                delete room.users[socket.id];
                socket.to(roomId).emit("user-left", socket.id);
                console.log(`User ${user.userName} left room ${roomId}`);

                // Clean up empty rooms
                if (Object.keys(room.users).length === 0) {
                    delete activeMeetings[roomId];
                    console.log(`Cleaned up empty room ${roomId}`);
                }
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});