"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = require("express");
const cart_Controller_1 = require("./cart.Controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const route = (0, express_1.Router)();
route.post('/create', (0, auth_1.default)(client_1.Role.USER), cart_Controller_1.cartController.createCartController);
route.get('/', (0, auth_1.default)(client_1.Role.USER), cart_Controller_1.cartController.getMyCartController);
route.delete(`/:id`, (0, auth_1.default)(client_1.Role.USER), cart_Controller_1.cartController.deleteCartController);
exports.cartRoutes = route;
