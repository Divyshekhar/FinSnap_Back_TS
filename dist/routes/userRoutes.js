"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController = require("../controllers/user");
router.post('/signup', userController.createUser);
router.put('/update/', userController.updateUser);
router.get('/', userController.getUser);
router.get('/:id', userController.getUserbyId);
router.post('/signin', userController.signIn);
module.exports = router;
