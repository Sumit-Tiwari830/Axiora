const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    isGlobal: {
        type: Boolean,
        default: false
    },
    targetClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass'
    }],
    attachment: {
        type: String,
        default: null
    },
    attachmentName: {
        type: String,
        default: null
    },
}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema)