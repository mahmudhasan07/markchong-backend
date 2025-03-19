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
exports.cartService = void 0;
const prisma_1 = require("../../../utils/prisma");
const ApiErrors_1 = __importDefault(require("../../error/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const createCartIntoDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findCart = yield prisma_1.prisma.cart.findFirst({
        where: {
            userId: id,
            foodId: payload.foodId
        }
    });
    if (findCart) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cart already exists");
    }
    const result = yield prisma_1.prisma.cart.create({ data: payload });
    return result;
});
const getMyCartFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.cart.findMany({
        where: {
            userId: userId
        }
    });
    return result;
});
exports.cartService = { createCartIntoDB, getMyCartFromDB };
