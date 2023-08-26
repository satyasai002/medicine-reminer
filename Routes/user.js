const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/userControllers")
router.post("/create-account", UserController.user_signup);
router.post("/login", UserController.user_login);
module.exports = router;
