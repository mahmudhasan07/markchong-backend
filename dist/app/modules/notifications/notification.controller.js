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
exports.notificationController = void 0;
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
const notification_service_1 = require("./notification.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../middleware/sendResponse"));
const sendNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const senderId = req.user.id;
    const notification = yield notification_service_1.notificationServices.sendSingleNotification(senderId, userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "notification sent successfully",
        data: notification,
    });
}));
const sendNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const notifications = yield notification_service_1.notificationServices.sendNotifications(userId, req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "notifications sent successfully",
        data: notifications,
    });
}));
// const getNotifications = catchAsync(async (req: Request, res: Response) => {
//   const options = req.query;
//   const notifications = await notificationServices.getNotificationsFromDB(
//     req,
//     options
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Notifications retrieved successfully",
//     data: notifications,
//   });
// });
const getNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_service_1.notificationServices.getNotificationsFromDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notifications retrieved successfully",
        data: notifications,
    });
}));
const getSingleNotificationById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.params.notificationId;
    const notification = yield notification_service_1.notificationServices.getSingleNotificationFromDB(req, notificationId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Notification retrieved successfully",
        data: notification,
    });
}));
exports.notificationController = {
    sendNotification,
    sendNotifications,
    getNotifications,
    getSingleNotificationById,
};
