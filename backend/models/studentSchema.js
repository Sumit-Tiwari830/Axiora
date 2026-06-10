const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    email: {
        type: String,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        subName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }],
    feePayments: [
        {
            feeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'fee'
            },
            amountPaid: {
                type: Number,
                default: 0
            },
            paymentDate: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['Paid', 'Pending'],
                default: 'Paid'
            },
            razorpayPaymentId: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model("student", studentSchema);