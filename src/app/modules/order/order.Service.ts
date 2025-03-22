import { title } from "process";
import { prisma } from "../../../utils/prisma"
import { notificationServices } from "../notifications/notification.service";
import { dataAvailableTime } from "../../helper/dataAvailableTime";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../error/ApiErrors";
const daysMap = {
    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6
};



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
            ...payload,
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

const adminOrdersFromDB = async () => {

    //     const date = new Date()
    //     const day = date.getDay()
    //     const today = Object.keys(daysMap).find(key => daysMap[key as keyof typeof daysMap] === day)
    //     console.log(today);
    //     const lastMonday = new Date();
    //     lastMonday.setDate(date.getDate() - ((day + 6) % 7)); // Moves to last Monday

    //     const nextMonday = new Date(lastMonday);
    // nextMonday.setDate(lastMonday.getDate() + 7); // Moves to next Monday
                                                                                                                             
    const result = await prisma.order.findMany({
        // where: {
        //     createdAt: {
        //         gte: nextMonday // Show orders only if today is next Monday or later
        //     }
        // },
        select: {
            id: true,
            totalPrice: true,
            location: true,
            marked: true,
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
            }
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
            status: "DELIVERED"
        }
    })
    return result
}

const updateOrderFromDB = async (payload: any, id: string) => {

    const result = await prisma.order.update({
        where: {
            id: id
        },
        data: {
            status: payload.status
        }
    })
    return result
}



export const orderService = { createOrderIntoDB, getMyOrdersFromDB, adminOrdersFromDB, exportOrderFromDB, updateOrderFromDB }


