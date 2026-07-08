const Notice = require('../models/noticeSchema.js');
const Student = require('../models/studentSchema.js');
const { Resend } = require('resend');

const noticeCreate = async (req, res) => {
    try {
        const { isGlobal, targetClasses } = req.body;
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID
        })
        const result = await notice.save()

        let studentsQuery = { school: req.body.adminID, emailVerified: true };
        if (!isGlobal && targetClasses && targetClasses.length > 0) {
            studentsQuery.sclassName = { $in: targetClasses };
        } else if (!isGlobal) {
            studentsQuery = null; // No target selected
        }

        if (studentsQuery) {
            const students = await Student.find(studentsQuery);
            if (students.length > 0 && process.env.RESEND_API_KEY) {
                const emails = students.map(s => s.email).filter(e => e);

                if (emails.length > 0) {
                    const resend = new Resend(process.env.RESEND_API_KEY);
                    resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: 'onboarding@resend.dev',
                        bcc: emails,
                        subject: `New Notice: ${req.body.title}`,
                        text: `A new notice has been posted.\n\nTitle: ${req.body.title}\nDetails: ${req.body.details}\nDate: ${req.body.date}`
                    }).catch(err => console.error("Failed to send notice emails", err));
                }
            }
        }

        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        let notices = await Notice.find({ school: req.params.id })
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };