import express from "express";
const authenticateJwt = require('../middleware/auth')
const router = express.Router();
const userController = require("../controllers/user");

router.post('/signup', userController.createUser);
router.put('/update', authenticateJwt,userController.updateUser);
router.get('/', userController.getUser);
router.get('/info', authenticateJwt, userController.getUserbyId);
router.post('/signin', userController.signIn);
router.post('/logout',authenticateJwt, userController.logout);
module.exports = router;