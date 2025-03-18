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
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const ApiErrors_1 = __importDefault(require("../../error/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (findUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User already exists");
    }
    const newPass = yield (0, bcrypt_1.hash)(payload.password, 10);
    const result = yield prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { password: newPass, status: "ACTIVE" }),
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
    // OTPFn(payload.email)
    return result;
});
const passwordChangeIntoDB = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = token && jsonwebtoken_1.default.decode(token);
    const findUser = yield prisma.user.findUnique({
        where: {
            email: userInfo && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.email)
        }
    });
    if (!findUser) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User is not exists");
    }
    const newPass = yield (0, bcrypt_1.hash)(payload.password, 10);
    const result = yield prisma.user.update({
        where: {
            email: userInfo && (userInfo === null || userInfo === void 0 ? void 0 : userInfo.email)
        },
        data: {
            password: newPass
        }
    });
    return result;
});
const updateUserIntoDB = (id, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    const userImage = image === null || image === void 0 ? void 0 : image.location;
    try {
        const update = yield prisma.user.update({
            where: {
                id
            },
            data: Object.assign(Object.assign({}, payload), { image: userImage !== null && userImage !== void 0 ? userImage : undefined })
        });
        return update;
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
});
exports.userServices = { createUserIntoDB, passwordChangeIntoDB, updateUserIntoDB };
