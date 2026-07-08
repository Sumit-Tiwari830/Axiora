const { Resend } = require('resend');
const Student = require('../models/studentSchema.js');

const addEmail = async (req, res) => {
    try {
        const { studentId, email } = req.body;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }
        
        // Generate a 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
        
        student.email = email;
        student.otp = otp;
        student.otpExpiry = otpExpiry;
        student.emailVerified = false;
        
        await student.save();
        
        // Send email via Resend
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Email Verification OTP - Axiora',
                text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`
            });
        } else {
            console.log("Resend API Key not set. OTP generated:", otp);
        }

        res.send({ message: "OTP sent to email successfully." });
    } catch (err) {
        console.error("Add Email Error:", err);
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { studentId, otp } = req.body;
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }
        
        if (student.otp !== otp) {
            return res.status(400).send({ message: "Invalid OTP" });
        }
        
        if (new Date() > student.otpExpiry) {
            return res.status(400).send({ message: "OTP has expired" });
        }
        
        student.emailVerified = true;
        student.otp = null;
        student.otpExpiry = null;
        
        await student.save();
        res.send({ message: "Email verified successfully", student });
    } catch (err) {
        console.error("Verify Email Error:", err);
        res.status(500).json({ message: err.message || "Internal server error" });
    }
};

module.exports = { addEmail, verifyEmail };
