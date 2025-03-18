import { Request, Response } from "express";
import { locationService } from "./location.Service";
import sendResponse from "../../middleware/sendResponse";
import { StatusCodes } from "http-status-codes";

const createLocationController = async (req: Request, res: Response) => {

    const body = req.body as any
    const result = await locationService.createLocationFormDB(body)
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Location added successfully", data: result })

}


export const locationController = { createLocationController }