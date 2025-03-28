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
exports.notificationServices = void 0;
// import admin from "../../../helpers/firebaseAdmin";
// import { paginationHelper } from "../../../helpers/paginationHelper";
const prisma_1 = require("../../../utils/prisma");
const ApiErrors_1 = __importDefault(require("../../error/ApiErrors"));
const firebaseAdmin_1 = __importDefault(require("../../helper/firebaseAdmin"));
// import ApiError from "../../errors/ApiError";
// import { IPaginationOptions } from "../../interface/pagination.type";
// import prisma from "../../utilis/prisma";
// Send notification to a single user
const sendSingleNotification = (userId, payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    yield prisma_1.prisma.notifications.create({
        data: {
            receiverId: userId,
            senderId: senderId,
            title: payload.title,
            body: payload.body,
        },
    });
    if (!(user === null || user === void 0 ? void 0 : user.fcmToken)) {
        throw new ApiErrors_1.default(404, "User not found with FCM token");
    }
    const message = {
        notification: {
            title: payload.title,
            body: payload.body,
        },
        token: user.fcmToken,
    };
    try {
        const response = yield firebaseAdmin_1.default.messaging().send(message);
        return response;
    }
    catch (error) {
        if (error.code === "messaging/invalid-registration-token") {
            throw new ApiErrors_1.default(400, "Invalid FCM registration token");
        }
        else if (error.code === "messaging/registration-token-not-registered") {
            throw new ApiErrors_1.default(404, "FCM token is no longer registered");
        }
        else {
            throw new ApiErrors_1.default(500, "Failed to send notification");
        }
    }
});
// Send notifications to all users with valid FCM tokens
const sendNotifications = (senderId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.prisma.user.findMany({
        where: {
            fcmToken: { not: null }, // Ensure fcmToken is not null
        },
        select: {
            id: true,
            fcmToken: true,
        },
    });
    if (!users || users.length === 0) {
        throw new ApiErrors_1.default(404, "No users found with FCM tokens");
    }
    const fcmTokens = users.map((user) => user.fcmToken);
    const message = {
        notification: {
            title: req.body.title,
            body: req.body.body,
        },
        tokens: fcmTokens,
    };
    const response = yield firebaseAdmin_1.default.messaging().sendEachForMulticast(message);
    // Find indices of successful responses
    const successIndices = response.responses
        .map((res, idx) => (res.success ? idx : null))
        .filter((idx) => idx !== null);
    // Filter users by success indices
    const successfulUsers = successIndices.map((idx) => users[idx]);
    // Prepare notifications data for only successfully notified users
    const notificationData = successfulUsers.map((user) => ({
        senderId: senderId,
        receiverId: user.id,
        title: req.body.title,
        body: req.body.body,
    }));
    // Save notifications only if there is data
    if (notificationData.length > 0) {
        yield prisma_1.prisma.notifications.createMany({
            data: notificationData,
        });
    }
    // Collect failed tokens
    const failedTokens = response.responses
        .map((res, idx) => (!res.success ? fcmTokens[idx] : null))
        .filter((token) => token !== null);
    return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
    };
});
const getNotificationsFromDB1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todayNotifications = yield prisma_1.prisma.notifications.findMany({
        where: {
            receiverId: req.user.id,
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            body: true,
            senderId: true,
            createdAt: true,
            sender: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    const last7DaysStart = new Date();
    last7DaysStart.setDate(last7DaysStart.getDate() - 7);
    last7DaysStart.setHours(0, 0, 0, 0);
    const last7DaysEnd = new Date(todayStart);
    last7DaysEnd.setMilliseconds(-1);
    const last7DaysNotifications = yield prisma_1.prisma.notifications.findMany({
        where: {
            receiverId: req.user.id,
            createdAt: {
                gte: last7DaysStart,
                lte: last7DaysEnd,
            },
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            body: true,
            senderId: true,
            createdAt: true,
            sender: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    return {
        meta: {
            total: yield prisma_1.prisma.notifications.count({
                where: { receiverId: req.user.id },
            }),
        },
        todayNotifications,
        last7DaysNotifications,
    };
});
const getNotificationsFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield prisma_1.prisma.notifications.findMany({
        where: {
            receiverId: req.user.id,
        },
        orderBy: { createdAt: "desc" },
    });
    if (notifications.length === 0) {
        throw new ApiErrors_1.default(404, "No notifications found for the user");
    }
    return notifications;
});
const getSingleNotificationFromDB = (req, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield prisma_1.prisma.notifications.findFirst({
        where: {
            id: notificationId,
            receiverId: req.user.id,
        },
    });
    const updatedNotification = yield prisma_1.prisma.notifications.update({
        where: { id: notificationId },
        data: { read: true },
        select: {
            id: true,
            title: true,
            body: true,
            senderId: true,
            createdAt: true,
            sender: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    return updatedNotification;
});
exports.notificationServices = {
    sendSingleNotification,
    sendNotifications,
    getNotificationsFromDB,
    getSingleNotificationFromDB,
};
