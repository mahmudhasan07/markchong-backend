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
exports.corsOptions = exports.myCache = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_cache_1 = __importDefault(require("node-cache"));
const route_1 = __importDefault(require("./app/route/route"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const mongodb_1 = require("mongodb");
const http_status_codes_1 = require("http-status-codes");
const PrismaConnection_1 = require("./app/DB/PrismaConnection");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_cron_1 = __importDefault(require("node-cron"));
const notification_service_1 = require("./app/modules/notifications/notification.service");
const prisma_1 = require("./utils/prisma");
exports.myCache = new node_cache_1.default({ stdTTL: 300 });
const app = (0, express_1.default)();
node_cron_1.default.schedule('0 12 * * 1', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Sending notifications to all users...');
    const admin = yield prisma_1.prisma.user.findFirst({
        where: { role: "ADMIN" },
    });
    const body = {
        title: "Weekly Notification",
        body: "New Items are available for order!",
    };
    try {
        if (admin === null || admin === void 0 ? void 0 : admin.id) {
            yield notification_service_1.notificationServices.sendNotifications(admin.id, body);
        }
        else {
            console.error('Admin ID is undefined. Notifications not sent.');
        }
        // await sendNotification(); // Call the function to send notifications
    }
    catch (error) {
        console.error('Error sending notifications:', error);
    }
}));
exports.corsOptions = {
    origin: [
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(exports.corsOptions));
app.get('/', (req, res) => {
    res.send('Welcome to development world');
});
const uploadPath = path_1.default.join(__dirname, "..", "uploads");
// Ensure uploads folder exists
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
    console.log("Uploads folder created successfully!");
}
app.use("/uploads", express_1.default.static(uploadPath));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield new mongodb_1.MongoClient(process.env.DATABASE_URL).connect();
        console.log(`MongoDB Connected Successfully`);
        (0, PrismaConnection_1.PrismaConnection)();
    }
    catch (error) {
        console.error(`Error: ${error === null || error === void 0 ? void 0 : error.message}`);
        process.exit(1); // Exit process with failure
    }
});
connectDB();
app.use("/api/v1", route_1.default);
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
