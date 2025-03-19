import { Cart } from "@prisma/client"
import { prisma } from "../../../utils/prisma"
import ApiError from "../../error/ApiErrors"
import { StatusCodes } from "http-status-codes"

const createCartIntoDB = async (payload: any, id: string) => {

    const findCart = await prisma.cart.findFirst({
        where: {
            userId: id,
            foodId: payload.foodId
        }
    })

    if (findCart) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Cart already exists")
    }

    const result = await prisma.cart.create({ data: payload })
    return result
}

const getMyCartFromDB = async (userId: string) => {
    const result = await prisma.cart.findMany({
        where : {
            userId : userId
        }
    })
    return result
}


export const cartService = { createCartIntoDB, getMyCartFromDB }