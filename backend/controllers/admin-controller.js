const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');
const OTP = require('../models/otpSchema.js');
const nodemailer = require('nodemailer');

const adminRegister = async (req, res) => {
    try {
        const { otp, ...fields } = req.body;

        const existingAdminByEmail = await Admin.findOne({ email: fields.email });
        const existingSchool = await Admin.findOne({ schoolName: fields.schoolName });

        if (existingAdminByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        if (existingSchool) {
            return res.send({ message: 'School name already exists' });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({ email: fields.email, otp });
        if (!otpRecord) {
            return res.send({ message: "Invalid or expired OTP" });
        }

        const admin = new Admin({
            ...fields
        });

        let result = await admin.save();
        
        // Delete the used OTP
        await OTP.deleteOne({ email: fields.email });

        result.password = undefined;
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const sendOTP = async (req, res) => {
    try {
        const { email, schoolName } = req.body;

        const existingAdminByEmail = await Admin.findOne({ email });
        const existingSchool = await Admin.findOne({ schoolName });

        if (existingAdminByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        if (existingSchool) {
            return res.send({ message: 'School name already exists' });
        }

        // Generate a 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

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
                subject: 'School Registration Verification OTP - Axiora',
                text: `Your OTP for school registration verification is ${otp}. It will expire in 10 minutes.`
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

const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            if (req.body.password === admin.password) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}


const updateAdmin = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        let result = await Admin.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports = { adminRegister, adminLogIn, getAdminDetail, updateAdmin, sendOTP };
