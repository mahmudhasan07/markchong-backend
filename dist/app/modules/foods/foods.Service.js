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
exports.foodService = void 0;
const ApiErrors_1 = __importDefault(require("../../error/ApiErrors"));
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../../../utils/prisma");
const createFoodIntoDB = (payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    const foodImage = image.location;
    console.log(foodImage);
    const result = yield prisma_1.prisma.food.create({
        data: Object.assign(Object.assign({}, payload), { image: foodImage })
    });
    return result;
});
const getAllFoodsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.food.findMany({});
});
const getSingleFoodFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.food.findUnique({
        where: {
            id
        }
    });
});
const deleteFoodFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.food.delete({
        where: {
            id
        }
    });
});
const updateFoodIntoDB = (id, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    const foodImage = image.filename;
    try {
        const result = yield prisma_1.prisma.food.update({
            where: {
                id
            },
            data: Object.assign(Object.assign({}, payload), { image: foodImage !== null && foodImage !== void 0 ? foodImage : undefined })
        });
        return result;
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Food not found");
    }
});
exports.foodService = { createFoodIntoDB, getAllFoodsFromDB, getSingleFoodFromDB, deleteFoodFromDB, updateFoodIntoDB };
