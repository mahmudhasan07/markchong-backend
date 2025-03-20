import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { foodService } from "./foods.Service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const addFoodController = catchAsync(async (req: Request, res: Response) => {

    const body = req.body as any
    const image = req.file as any

    const result = await foodService.createFoodIntoDB(body, image)

    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Food added successfully", data: result })

})


const getAllFoodController = catchAsync(async (req: Request, res: Response) => {

    const result = await foodService.getAllFoodsFromDB()

    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Foods retrieved successfully", data: result })
})


const availableFoodController = catchAsync(async(req:Request, res:Response)=>{

    const result = await foodService.availableFoodsFromDB()

    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Foods retrieved successfully", data: result })
})

const getSingleFoodController = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const result = await foodService.getSingleFoodFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Foods retrieved successfully", data: result })
})

const deleteFoodController = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const result = await foodService.deleteFoodFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Foods deleted successfully", data: result })
})

const updateFoodController = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id as string
    const body = req.body as any
    const image = req.file as any

    const result = await foodService.updateFoodIntoDB(id, body, image)

    sendResponse(res, { statusCode: StatusCodes.OK, message: "Food updated successfully", success: true, data: result })
})

export const foodController = { addFoodController, getAllFoodController, getSingleFoodController, deleteFoodController, updateFoodController, availableFoodController }