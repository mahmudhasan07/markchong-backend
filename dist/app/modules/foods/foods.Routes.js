"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const foods_Controller_1 = require("./foods.Controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const foods_Validation_1 = require("./foods.Validation");
const uploadFile_1 = require("../../helper/uploadFile");
const parseBodyData_1 = require("../../middleware/parseBodyData");
const route = (0, express_1.Router)();
route.post('/create', (0, auth_1.default)(client_1.Role.ADMIN), uploadFile_1.fileUploader.uploadFoodImages, parseBodyData_1.parseBodyMiddleware, (0, validateRequest_1.default)(foods_Validation_1.foodValidation.addFoodValidation), foods_Controller_1.foodController.addFoodController);
route.get('/', (0, auth_1.default)(), foods_Controller_1.foodController.getAllFoodController);
route.get("/available", (0, auth_1.default)(), foods_Controller_1.foodController.availableFoodController);
route.get(`/:id`, (0, auth_1.default)(), foods_Controller_1.foodController.getSingleFoodController);
route.delete(`/:id`, (0, auth_1.default)(client_1.Role.ADMIN), foods_Controller_1.foodController.deleteFoodController);
route.put(`/:id`, (0, auth_1.default)(client_1.Role.ADMIN), uploadFile_1.fileUploader.uploadFoodImages, parseBodyData_1.parseBodyMiddleware, (0, validateRequest_1.default)(foods_Validation_1.foodValidation.updateFoodValidation), foods_Controller_1.foodController.updateFoodController);
exports.foodRoutes = route;
