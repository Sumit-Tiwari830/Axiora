const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '10m' } }
});

module.exports = mongoose.model("otp", otpSchema);
