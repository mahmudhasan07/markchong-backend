import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import router from './app/route/route';
import GlobalErrorHandler from './app/middleware/globalErrorHandler';
import { MongoClient } from "mongodb"
import { StatusCodes } from 'http-status-codes';
import { PrismaConnection } from './app/DB/PrismaConnection';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import { notificationServices } from './app/modules/notifications/notification.service';
import { prisma } from './utils/prisma';

export const myCache = new NodeCache({ stdTTL: 300 })
const app = express();



cron.schedule('0 12 * * 1', async () => {
    console.log('Sending notifications to all users...');
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    })
    const body = {
        title: "Weekly Notification",
        body: "New Items are available for order!",
    }
    try {
        if (admin?.id) {
            await notificationServices.sendNotifications(admin.id, body);
            console.log('Notifications sent successfully!');
            
        } else {
            console.error('Admin ID is undefined. Notifications not sent.');
        }
        // await sendNotification(); // Call the function to send notifications
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
});

export const corsOptions = {
    origin: [
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Welcome to development world');
});

const uploadPath = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("Uploads folder created successfully!");
}

app.use("/uploads", express.static(uploadPath));


const connectDB = async () => {
    try {
        const conn = await new MongoClient(process.env.DATABASE_URL as string).connect();
        console.log(`MongoDB Connected Successfully`);
        PrismaConnection()
    } catch (error: any) {
        console.error(`Error: ${error?.message}`);
        process.exit(1); // Exit process with failure
    }
};

connectDB()

app.use("/api/v1", router)
app.use(GlobalErrorHandler)


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});



export default app
