const Admin = require("../models/adminSchema");

const adminRegister = async (req, res) => {
    try {
        const admin = new Admin(req.body);

        const existingAdmin = await Admin.findOne({
            email: req.body.email
        });

        if (existingAdmin) {
            return res.send({
                message: "Email already exists"
            });
        }

        const result = await admin.save();

        result.password = undefined;

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    try {
        const admin = await Admin.findOne({
            email: req.body.email
        });

        if (!admin) {
            return res.send({
                message: "User not found"
            });
        }

        if (admin.password !== req.body.password) {
            return res.send({
                message: "Invalid password"
            });
        }

        admin.password = undefined;

        res.send(admin);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    adminRegister,
    adminLogIn
};