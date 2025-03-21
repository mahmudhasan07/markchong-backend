import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { orderService } from "./order.Service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../middleware/sendResponse";

const createOrderController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user
    const body = req.body
    const result = await orderService.createOrderIntoDB(body, id)
    sendResponse(res, { statusCode: StatusCodes.CREATED, success: true, message: "Order created successfully", data: result })

});


const myOrderController = catchAsync(async (req: Request, res: Response) => {

    const { id } = req?.user

    const result = await orderService.getMyOrdersFromDB(id)

    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Orders retrieved successfully", data: result })

})


const todayOrderController = catchAsync(async (req: Request, res: Response) => {
    const result = await orderService.adminOrdersFromDB()

    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Orders retrieved successfully", data: result })

})

const exportOrderController = catchAsync(async (req: Request, res: Response) => {

    const result = await orderService.exportOrderFromDB()
    sendResponse(res, {statusCode : StatusCodes.OK, message : "Orders exported successfully", success : true, data : result})

})


const updateOrderController = catchAsync(async (req: Request, res: Response) => {
    
    const id = req.params.id
    const body = req.body

    const result = await orderService.updateOrderFromDB(body, id)

    sendResponse(res, {statusCode : StatusCodes.OK, message : "Order updated successfully", success : true, data : result})


})


export const orderController = { createOrderController, todayOrderController, myOrderController, exportOrderController, updateOrderController }