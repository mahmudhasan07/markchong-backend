import { Food, PrismaClient } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";

const createFoodIntoDB = async (payload: Food, image: any) => {

    const foodImage = image.location
    console.log(foodImage);
    

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

const getSingleFoodFromDB = async (id: string) => {
    const result = await prisma.food.findUnique({
        where: {
            id
        }
    })
}

const deleteFoodFromDB = async (id: string) => {
    const result = await prisma.food.delete({
        where: {
            id
        }
    })
}


const updateFoodIntoDB = async (id: string, payload: any, image: any) => {

    const foodImage = image.filename

    try {
        const result = await prisma.food.update({
            where: {
                id
            },
            data: {
                ...payload,
                image: foodImage ?? undefined
            }
        })

        return result
    } catch (error) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Food not found")
    }


}


export const foodService = { createFoodIntoDB, getAllFoodsFromDB, getSingleFoodFromDB, deleteFoodFromDB, updateFoodIntoDB }
