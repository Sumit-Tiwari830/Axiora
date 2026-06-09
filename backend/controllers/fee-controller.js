const Fee = require('../models/feeSchema.js');

const createFee = async (req, res) => {
    try {
        const fee = new Fee(req.body);
        const result = await fee.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFeesList = async (req, res) => {
    try {
        let fees = await Fee.find({ school: req.params.id }).populate("sclassName", "sclassName");
        if (fees.length > 0) {
            res.send(fees);
        } else {
            res.send({ message: "No fees found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFeeDetails = async (req, res) => {
    try {
        let fee = await Fee.findById(req.params.id);
        if (fee) {
            res.send(fee);
        } else {
            res.send({ message: "No fee found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { createFee, getFeesList, getFeeDetails };
