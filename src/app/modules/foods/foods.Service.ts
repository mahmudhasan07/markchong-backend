import { Food, PrismaClient } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../utils/prisma";
import { deleteFile } from "../../helper/deleteFile";
import { dataAvailableTime } from "../../helper/dataAvailableTime";

const createFoodIntoDB = async (payload: Food, image: any) => {

    const foodImage = image?.location

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
    return result
}

const availableFoodsFromDB = async () => {

    if (dataAvailableTime()) {
        const result = await prisma.food.findMany({})
        return result
    }

    throw new ApiError(StatusCodes.BAD_REQUEST, "Foods not available")

}


const getSingleFoodFromDB = async (id: string) => {
    const result = await prisma.food.findUnique({
        where: {
            id
        }
    })

    return result

}

const deleteFoodFromDB = async (id: string) => {
    const result = await prisma.food.delete({
        where: {
            id
        }
    })

    if (result.image) {
        const res = await deleteFile.deleteS3Image(result.image?.split(".com/")[1] as string)
    }

    return result

}


const updateFoodIntoDB = async (id: string, payload: any, image: any) => {
    const foodImage = image?.location
    const findProduct = await prisma.food.findUnique({
        where: {
            id
        }
    })

    if (findProduct && findProduct?.image) {
        const result = await deleteFile.deleteS3Image(findProduct?.image?.split(".com/")[1] as string)
        if (result == false) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong")
        }
    }
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


export const foodService = { createFoodIntoDB, getAllFoodsFromDB, getSingleFoodFromDB, deleteFoodFromDB, updateFoodIntoDB, availableFoodsFromDB }
