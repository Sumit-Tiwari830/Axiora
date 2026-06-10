const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String
    },
    ended: {
        type: Boolean,
        default: false
    },
    endedAt: {
        type: Date
    },
    endedBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("meeting", meetingSchema);
