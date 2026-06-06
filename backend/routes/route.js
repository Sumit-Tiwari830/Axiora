const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
    res.json({
        success: true,
        message: "Axiora API Running"
    });
});

module.exports = router;