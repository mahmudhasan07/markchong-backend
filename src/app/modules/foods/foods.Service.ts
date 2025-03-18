import { Food, PrismaClient } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";

const createFoodIntoDB = async (payload: Food, image : any) => {

    const foodImage = image[0].filename

    const result = await prisma.food.create({
        data: {
            ...payload,
            image: foodImage
        }
    })

    return result

}

const getAllFoodsFromDB = async () => {
    const result = await prisma.food.findMany({})
}

const getSingleFoodFromDB = async (id : string) => {
    const result = await prisma.food.findUnique({
        where: {
            id
        }
    })
}

const deleteFoodFromDB = async (id : string) => {
    const result = await prisma.food.delete({
        where: {
            id
        }
    })
}


const updateFoodIntoDB = async (id : string, payload: any, images : any) => {

    const foodImage = images[0].filename

    const findFood = await prisma.food.findUnique({
        where: {
            id
        }
    })

    if (!findFood) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Food not found")
    }
    const result = await prisma.food.update({
        where: {
            id
        },
        data: {
            ...payload,
            image : foodImage || (findFood && findFood?.image)
        }
    })

   return result

}


export const foodService = { createFoodIntoDB, getAllFoodsFromDB, getSingleFoodFromDB, deleteFoodFromDB, updateFoodIntoDB }
