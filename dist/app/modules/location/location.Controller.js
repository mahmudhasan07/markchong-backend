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
exports.locationController = void 0;
const location_Service_1 = require("./location.Service");
const sendResponse_1 = __importDefault(require("../../middleware/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const createLocationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield location_Service_1.locationService.createLocationFormDB(body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.CREATED, success: true, message: "Location added successfully", data: result });
}));
const getAllLocationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield location_Service_1.locationService.getAllLocationFromDB();
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Locations retrieved successfully", data: result });
}));
const deleteLocationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield location_Service_1.locationService.deleteLocationFromDB(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_codes_1.StatusCodes.OK, success: true, message: "Location deleted successfully", data: result });
}));
exports.locationController = { createLocationController, getAllLocationController, deleteLocationController };
