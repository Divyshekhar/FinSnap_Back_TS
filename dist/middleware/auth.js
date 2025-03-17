"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = require("dotenv");
dotenv.config();
const authenticateJwt = (req, res, next) => {
    var _a;
    const authHeader = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!authHeader)
        return res.status(401).json({ message: "Unauthorized: No Token" });
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : authHeader;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Token error" });
    }
};
module.exports = authenticateJwt;
