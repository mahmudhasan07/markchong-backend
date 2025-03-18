"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRouters = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const notification_validation_1 = require("./notification.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/send-notification/:userId", (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.cerateNotification), (0, auth_1.default)(), notification_controller_1.notificationController.sendNotification);
router.post("/send-notification", (0, validateRequest_1.default)(notification_validation_1.NotificationValidation.cerateNotification), (0, auth_1.default)(), notification_controller_1.notificationController.sendNotifications);
router.get('/', (0, auth_1.default)(), notification_controller_1.notificationController.getNotifications);
router.get('/:notificationId', (0, auth_1.default)(), notification_controller_1.notificationController.getSingleNotificationById);
exports.NotificationsRouters = router;
