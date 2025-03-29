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
exports.orderService = void 0;
const prisma_1 = require("../../../utils/prisma");
const notification_service_1 = require("../notifications/notification.service");
const dataAvailableTime_1 = require("../../helper/dataAvailableTime");
const http_status_codes_1 = require("http-status-codes");
const ApiErrors_1 = __importDefault(require("../../error/ApiErrors"));
const daysMap = {
    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6
};
const json2csv_1 = require("json2csv");
const createOrderIntoDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, dataAvailableTime_1.dataAvailableTime)(1, 12, 3, 16)) {
        throw new ApiErrors_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The order period has ended. Please try again on Monday after 12 p.m.");
    }
    // console.log(payload, "payload");
    // console.log(id, "id");
    const result = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Fetch cart items
        const myCarts = yield prisma.cart.findMany({
            where: { userId: id },
            select: {
                foodId: true,
                quantity: true,
                foodDetails: {
                    select: {
                        price: true,
                    }
                }
            }
        });
        const totalPrice = myCarts.reduce((acc, item) => {
            var _a;
            const price = ((_a = item.foodDetails) === null || _a === void 0 ? void 0 : _a.price) || 0; // Default to 0 if price is undefined
            return acc + price * item.quantity;
        }, 0);
        // Create order
        const order = yield prisma.order.create({
            data: {
                userId: id,
                location: payload.location,
                totalPrice: payload.totalPrice == totalPrice ? payload.totalPrice : totalPrice,
                Items: {
                    create: myCarts.map(({ foodId, quantity }) => ({ foodId, quantity })) || []
                }
            },
        });
        // Delete cart items
        yield prisma.cart.deleteMany({
            where: {
                userId: id
            }
        });
        // Send notification
        const body = {
            title: "Order Complete",
            body: "Your order has been confirmed"
        };
        yield notification_service_1.notificationServices.sendSingleNotification(id, body);
        return order;
    }));
    console.log(result);
    return result;
});
const getMyOrdersFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await prisma.order.findMany({
    //     where: { userId: id },
    //     select: {
    //         Items: {
    //             select: {
    //                 foodDetails: {
    //                     select: {
    //                         name: true,
    //                         image: true,
    //                         price: true
    //                     }
    //                 },
    //                 quantity: true
    //             }
    //         },
    //     }
    // })
    const result = yield prisma_1.prisma.items.findMany({
        where: {
            orderDetails: {
                userId: id
            }
        },
        select: {
            foodDetails: {
                select: {
                    name: true,
                    image: true,
                    price: true,
                    day: true
                }
            },
            quantity: true,
            orderId: true,
            id: true,
            orderDetails: {
                select: {
                    totalPrice: true,
                    location: true,
                    status: true,
                    id: true,
                    createdAt: true,
                    userId: true,
                }
            }
        },
    });
    return result;
});
const adminOrdersFromDB = (status) => __awaiter(void 0, void 0, void 0, function* () {
    //     const date = new Date()
    //     const day = date.getDay()
    //     const today = Object.keys(daysMap).find(key => daysMap[key as keyof typeof daysMap] === day)
    //     console.log(today);
    //     const lastMonday = new Date();
    //     lastMonday.setDate(date.getDate() - ((day + 6) % 7)); // Moves to last Monday
    //     const nextMonday = new Date(lastMonday);
    // nextMonday.setDate(lastMonday.getDate() + 7); // Moves to next Monday
    const result = yield prisma_1.prisma.order.findMany({
        where: {
            status: status
        },
        select: {
            id: true,
            totalPrice: true,
            location: true,
            marked: true,
            status: true,
            createdAt: true,
            Items: {
                select: {
                    foodDetails: {
                        select: {
                            day: true,
                            name: true,
                            image: true
                        }
                    },
                    quantity: true,
                    id: true,
                    orderId: true
                }
            },
            userDetails: {
                select: {
                    name: true,
                    email: true
                }
            },
        }
    });
    return result;
    // console.log(todayOrders);
    // return todayOrders
    // const result = await prisma.order.findMany({})
    // return result
});
const exportOrderFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.order.findMany({
        where: {
            status: "DELIVERED",
        },
        select: {
            userDetails: {
                select: {
                    name: true,
                    email: true
                }
            },
            Items: {
                select: {
                    foodDetails: {
                        select: {
                            name: true,
                            price: true,
                            day: true
                        }
                    },
                    quantity: true
                }
            },
            location: true,
        }
    });
    const transformedOrders = result.flatMap(order => order.Items.map(item => ({
        name: order.userDetails.name,
        email: order.userDetails.email,
        foodName: item.foodDetails.name,
        price: item.foodDetails.price,
        quantity: item.quantity,
        location: order.location,
        day: item.foodDetails.day
    })));
    const csv = (0, json2csv_1.parse)(transformedOrders);
    return csv;
});
const updateOrderFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.order.updateMany({
        where: {
            id: {
                in: payload.ids
            }
        },
        data: {
            status: payload.status
        }
    });
    return result;
});
const getLocationOrderFromDB = (location) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.order.findMany({
        where: {
            location: {
                contains: location, // Match full or partial location
                mode: "insensitive" // Ignore case sensitivity
            }
        },
        select: {
            id: true,
            totalPrice: true,
            location: true,
            marked: true,
            status: true,
            createdAt: true,
            Items: {
                select: {
                    foodDetails: {
                        select: {
                            day: true,
                            name: true,
                            image: true
                        }
                    },
                    quantity: true,
                    id: true,
                    orderId: true
                }
            },
            userDetails: {
                select: {
                    name: true,
                    email: true
                }
            },
        }
    });
    return result;
});
exports.orderService = { createOrderIntoDB, getMyOrdersFromDB, adminOrdersFromDB, exportOrderFromDB, updateOrderFromDB, getLocationOrderFromDB };
