const express = require("express");

const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");


router.post("/auth/signup", signup);

router.post("/auth/login", login);


module.exports = router;