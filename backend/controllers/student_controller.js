const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Admin = require('../models/adminSchema.js');

const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ...req.body,
                school: req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (req, res) => {
    try {
        if (req.body.rollNum && req.body.studentName && req.body.password && req.body.schoolName) {
            const school = await Admin.findOne({ schoolName: req.body.schoolName });
            if (!school) {
                return res.send({ message: "School not found" });
            }

            let student = await Student.findOne({ 
                rollNum: req.body.rollNum, 
                name: { $regex: new RegExp(`^${req.body.studentName.trim()}$`, 'i') },
                school: school._id
            });
        if (student) {
            const validated = await bcrypt.compare(req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
        } else {
            res.send({ message: "Roll Number, Student Name, School Name, and Password are required" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();

        // Check for low marks (< 35 out of 100) and dispatch notice
        if (subject && Number(marksObtained) < 35) {
            const Notice = require('../models/noticeSchema.js');
            const title = `⚠️ Academic Warning: Low Marks for ${student.name} (${subject.subName})`;
            const details = `Dear ${student.name}, you have obtained low marks in the subject "${subject.subName}" (Marks Obtained: ${marksObtained}/100). We encourage you to review the class materials, spend more time studying, and consult with your subject teacher for support.`;

            const existingNotice = await Notice.findOne({
                title,
                school: student.school
            });

            if (!existingNotice) {
                const notice = new Notice({
                    title,
                    details,
                    date: new Date(),
                    school: student.school,
                    isGlobal: false,
                    targetClasses: [student.sclassName]
                });
                await notice.save();

                // Send email if student has a verified email and SMTP is configured
                if (student.email && student.emailVerified && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    const nodemailer = require('nodemailer');
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: student.email,
                        subject: title,
                        text: details
                    };
                    transporter.sendMail(mailOptions).catch(err => console.error("Failed to send exam marks warning email", err));
                }
            }
        }

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        if (!subject) {
            return res.send({ message: 'Subject not found' });
        }

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();

        // Calculate attendance percentage for this subject
        const totalSessions = subject.sessions || 0;
        const presentSessions = student.attendance.filter(
            (a) => a.subName.toString() === subName && a.status === 'Present'
        ).length;
        const totalMarked = student.attendance.filter(
            (a) => a.subName.toString() === subName
        ).length;

        // Use subject sessions as total, fallback to actual marked records if sessions is 0
        const totalBase = totalSessions > 0 ? totalSessions : totalMarked;
        const percentage = totalBase > 0 ? (presentSessions / totalBase) * 100 : 100;

        // Send a warning notice if attendance falls below 70% and there is a decent history (at least 2 entries or sessions set)
        if (percentage < 70 && (totalBase > 0)) {
            const Notice = require('../models/noticeSchema.js');
            const title = `⚠️ Low Attendance Alert: ${student.name} (${subject.subName})`;
            const details = `Dear ${student.name}, your attendance in the subject "${subject.subName}" has fallen below the required 70%. Your current attendance is ${percentage.toFixed(2)}% (${presentSessions}/${totalBase} sessions). Please make sure to attend classes regularly to avoid academic penalties.`;

            const existingNotice = await Notice.findOne({
                title,
                school: student.school
            });

            if (!existingNotice) {
                const notice = new Notice({
                    title,
                    details,
                    date: new Date(),
                    school: student.school,
                    isGlobal: false,
                    targetClasses: [student.sclassName]
                });
                await notice.save();

                // Send email warning
                if (student.email && student.emailVerified && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    const nodemailer = require('nodemailer');
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: student.email,
                        subject: title,
                        text: details
                    };
                    transporter.sendMail(mailOptions).catch(err => console.error("Failed to send attendance warning email", err));
                }
            }
        }

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
    const subName = req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    const schoolId = req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    const studentId = req.params.id;
    const subName = req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};