"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController = require("../controllers/user");
router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser);
router.get('/', userController.getUser);
router.get('/:id', userController.getUserbyId);
module.exports = router;
