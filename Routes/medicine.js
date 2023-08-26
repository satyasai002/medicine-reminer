const express = require("express");
const router = express.Router();
const medicineController = require("../Controllers/medicineControllers");
const checkAuth = require("../Middleware/check-auth");

router.post("/create-medicine", checkAuth, medicineController.medicine_create);
router.post("/decrease-medicine", medicineController.medicine_decrease);
router.post("/get-medicine", medicineController.medicine_get);
router.post("/get-user-medicine", medicineController.medicine_UserMedicine);
router.get("/", medicineController.medicine_getReminder);
router.post("/delete", medicineController.medicine_deleteMedicine);
module.exports = router;
