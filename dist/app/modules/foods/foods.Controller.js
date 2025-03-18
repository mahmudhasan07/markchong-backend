"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const foods_Service_1 = require("./foods.Service");
const sendResponse_1 = __importDefault(require("../../middleware/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const addFoodController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const image = req.file;
    const result = yield foods_Service_1.foodService.createFoodIntoDB(body, image);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.CREATED, success: true, message: "Food added successfully", data: result });
}));
const getAllFoodController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield foods_Service_1.foodService.getAllFoodsFromDB();
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Foods retrieved successfully", data: result });
}));
const getSingleFoodController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const result = yield foods_Service_1.foodService.getSingleFoodFromDB(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Foods retrieved successfully", data: result });
}));
const deleteFoodController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const result = yield foods_Service_1.foodService.deleteFoodFromDB(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Foods deleted successfully", data: result });
}));
const updateFoodController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const body = req.body;
    const image = req.file;
    const result = yield foods_Service_1.foodService.updateFoodIntoDB(id, body, image);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, message: "Food updated successfully", success: true, data: result });
}));
exports.foodController = { addFoodController, getAllFoodController, getSingleFoodController, deleteFoodController, updateFoodController };
