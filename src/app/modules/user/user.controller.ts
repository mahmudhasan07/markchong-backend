import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";


const createUserController = catchAsync(async (req: Request, res: Response) => {

    const result = await userServices.createUserIntoDB(req.body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Account created successfully", data: result, success: true })
})


const passwordChangeController = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body
    const token = req.headers.authorization as string

    const result = await userServices.passwordChangeIntoDB(payload, token)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User updated successfully", data: result, success: true })
})

const updateUserController = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.user
    const body = req?.body as any
   
    const result = await userServices.updateUserIntoDB(id, body)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User updated successfully", data: result, success: true })
})


const meController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await userServices.meFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, message: "User retrieved successfully", data: result, success: true })
})

export const userController = { createUserController, passwordChangeController, updateUserController, meController }