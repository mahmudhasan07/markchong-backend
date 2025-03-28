"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const order_Controller_1 = require("./order.Controller");
const route = (0, express_1.Router)();
route.post('/create', (0, auth_1.default)(client_1.Role.USER), order_Controller_1.orderController.createOrderController);
route.get('/my-order', (0, auth_1.default)(client_1.Role.USER), order_Controller_1.orderController.myOrderController);
route.get('/', (0, auth_1.default)(client_1.Role.ADMIN), order_Controller_1.orderController.adminOrderController);
route.get("/exports", order_Controller_1.orderController.exportOrderController);
route.get("/location/:id", (0, auth_1.default)(client_1.Role.ADMIN), order_Controller_1.orderController.getLocationOrderController);
route.put(`/update`, (0, auth_1.default)(client_1.Role.ADMIN), order_Controller_1.orderController.updateOrderController);
exports.orderRoutes = route;
