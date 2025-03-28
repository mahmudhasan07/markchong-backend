"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const route = (0, express_1.Router)();
route.post('/create', (0, validateRequest_1.default)(user_validation_1.UserValidation.createValidation), user_controller_1.userController.createUserController);
route.put('/change-password', user_controller_1.userController.passwordChangeController);
route.put("/me", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), user_controller_1.userController.updateUserController);
route.get("/me", (0, auth_1.default)(client_1.Role.USER, client_1.Role.ADMIN), user_controller_1.userController.meController);
exports.userRoutes = route;
