const express = require("express");
const auth = require("../middleware/auth");

const {
    adminRegister,
    adminLogIn
} = require("../controllers/admin-controller");

const router = express.Router();

router.get("/", auth, (req, res) => {
    res.json({
        success: true,
        message: "Axiora API Running"
    });
});

router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);

module.exports = router;