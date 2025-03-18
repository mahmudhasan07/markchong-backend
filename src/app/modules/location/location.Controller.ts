import { Request, Response } from "express";
import { locationService } from "./location.Service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";

const createLocationController = catchAsync(async (req: Request, res: Response) => {
    const body = req.body as any
    const result = await locationService.createLocationFormDB(body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Location added successfully", data: result })
})

const getAllLocationController = catchAsync(async (req: Request, res: Response) => {
    const result = await locationService.getAllLocationFromDB()
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Locations retrieved successfully", data: result })
})

const deleteLocationController = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const result = await locationService.deleteLocationFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Location deleted successfully", data: result })
})


export const locationController = { createLocationController, getAllLocationController, deleteLocationController }