import { Request, Response } from "express"
import { cartService } from "./cart.Service"
import sendResponse from "../../middleware/sendResponse"
import { StatusCodes } from "http-status-codes"
import catchAsync from "../../../shared/catchAsync"

const createCartController = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user
    const body = req.body
    const result = await cartService.createCartIntoDB(body, id)
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Cart created successfully", data: result })

})

const getMyCartController = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.user
    const result = await cartService.getMyCartFromDB(id)
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Cart retrieved successfully", data: result })
})

const deleteCartController = catchAsync(async (req: Request, res: Response) => {

    const cartId = req.params.id
    const { id } = req.user

    const result = await cartService.deleteCartFromDB(cartId, id)
    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Cart deleted successfully", data: result })

})

export const cartController = { createCartController, getMyCartController, deleteCartController }