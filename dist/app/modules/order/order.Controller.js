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
exports.orderController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const order_Service_1 = require("./order.Service");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../middleware/sendResponse"));
const pagination_1 = require("../../helper/pagination");
const createOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const body = req.body;
    const result = yield order_Service_1.orderService.createOrderIntoDB(body, id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.CREATED, success: true, message: "Order created successfully", data: result });
}));
const myOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield order_Service_1.orderService.getMyOrdersFromDB(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Orders retrieved successfully", data: result });
}));
const adminOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const status = (_a = req.query.status) === null || _a === void 0 ? void 0 : _a.toString().toUpperCase();
    const result = yield order_Service_1.orderService.adminOrdersFromDB(status);
    const { data, limit, page, total, totalPage } = yield (0, pagination_1.paginationSystem)(result, req);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Orders retrieved successfully", data: data, meta: { limit, page, total, totalPage } });
}));
const exportOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_Service_1.orderService.exportOrderFromDB();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="orders.csv"');
    // Send CSV data
    // res.download(result);
    res.send(result);
    // sendResponse(res, { statusCode: StatusCodes.OK, message: "Orders exported successfully", success: true })
}));
const updateOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield order_Service_1.orderService.updateOrderFromDB(body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, message: "Order updated successfully", success: true, data: result });
}));
const getLocationOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const location = req.params.id;
    const result = yield order_Service_1.orderService.getLocationOrderFromDB(location);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, message: "Orders retrieved successfully", success: true, data: result });
}));
exports.orderController = { createOrderController, adminOrderController, myOrderController, exportOrderController, updateOrderController, getLocationOrderController };
