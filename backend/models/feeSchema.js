const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    feeAmount: {
        type: Number,
        required: true
    },
    feeDetails: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("fee", feeSchema);
