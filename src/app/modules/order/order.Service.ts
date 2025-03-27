import { title } from "process";
import { prisma } from "../../../utils/prisma"
import { notificationServices } from "../notifications/notification.service";
import { dataAvailableTime } from "../../helper/dataAvailableTime";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../error/ApiErrors";
import { FoodStatus } from "@prisma/client";
const daysMap = {
    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6
};

import fs from "fs";
import { parse } from "json2csv";

const createOrderIntoDB = async (payload: any, id: string) => {

    // if (!dataAvailableTime(1, 12, 3, 16)) {
    //     throw new ApiError(StatusCodes.BAD_REQUEST, "The order period has ended. Please try again on Monday after 12 p.m.")
    // } 


    const myCarts = await prisma.cart.findMany({
        where: { userId: id },
        select: {
            foodId: true,
            quantity: true
        }
    })
    console.log(myCarts);
    const result = await prisma.order.create({
        data: {
            userId: id,
            location: payload?.location,
            Items: {
                create: myCarts || []
            }
        },
    })

    await prisma.cart.deleteMany({
        where: {
            userId: id
        }
    })

    const body = {
        title: "Order Complete",
        body: "Your order has been confirmed"
    }

    await notificationServices.sendSingleNotification(id, body)


    return result
}

const getMyOrdersFromDB = async (id: string) => {
    const result = await prisma.order.findMany({
        where: { userId: id },
        select: {
            id: true,
            totalPrice: true,
            status: true,
            Items: {
                select: {
                    foodDetails: {
                        select: {
                            name: true,
                            image: true,
                            price: true
                        }
                    },
                    quantity: true
                }
            },


        }
    })
    return result
}

const adminOrdersFromDB = async (status: FoodStatus) => {

    //     const date = new Date()
    //     const day = date.getDay()
    //     const today = Object.keys(daysMap).find(key => daysMap[key as keyof typeof daysMap] === day)
    //     console.log(today);
    //     const lastMonday = new Date();
    //     lastMonday.setDate(date.getDate() - ((day + 6) % 7)); // Moves to last Monday

    //     const nextMonday = new Date(lastMonday);
    // nextMonday.setDate(lastMonday.getDate() + 7); // Moves to next Monday

    const result = await prisma.order.findMany({
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

    })

    return result


    // console.log(todayOrders);


    // return todayOrders

    // const result = await prisma.order.findMany({})
    // return result
}


const exportOrderFromDB = async () => {

    const result = await prisma.order.findMany({
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
    })

    const transformedOrders = result.flatMap(order =>
        order.Items.map(item => ({
            name: order.userDetails.name,
            email: order.userDetails.email,
            foodName: item.foodDetails.name,
            price: item.foodDetails.price,
            quantity: item.quantity,
            location: order.location,
            day: item.foodDetails.day
        }))
    );

    const csv = parse(transformedOrders);

    return csv
}

const updateOrderFromDB = async (payload: any) => {


    const result = await prisma.order.updateMany({
        where: {
            id: {
                in: payload.ids
            }
        },
        data: {
            status: payload.status
        }
    })
    return result
}


const getLocationOrderFromDB = async (location: string) => {
    const result = await prisma.order.findMany({
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
}

export const orderService = { createOrderIntoDB, getMyOrdersFromDB, adminOrdersFromDB, exportOrderFromDB, updateOrderFromDB, getLocationOrderFromDB }


