import express from "express";
const router = express.Router();
const userController = require("../controllers/user");

router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser);
router.get('/', userController.getUser);
router.get('/:id', userController.getUserbyId);
module.exports = router;