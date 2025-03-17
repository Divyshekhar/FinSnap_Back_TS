"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateJwt = require('../middleware/auth');
const router = express_1.default.Router();
const userController = require("../controllers/user");
router.post('/signup', userController.createUser);
router.put('/update', authenticateJwt, userController.updateUser);
router.get('/', userController.getUser);
router.get('/info', authenticateJwt, userController.getUserbyId);
router.post('/signin', userController.signIn);
router.post('/logout', authenticateJwt, userController.logout);
router.get('/token', userController.getToken);
module.exports = router;
