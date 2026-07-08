const nodemailer = require('nodemailer');
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
        
        // Send email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '465'),
                secure: process.env.SMTP_SECURE ? (process.env.SMTP_SECURE === 'true') : true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification OTP - Axiora',
                text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.log("Email credentials not set. OTP generated:", otp);
        }

        res.send({ message: "OTP sent to email successfully." });
    } catch (err) {
        res.status(500).json(err);
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
        res.status(500).json(err);
    }
};

module.exports = { addEmail, verifyEmail };
