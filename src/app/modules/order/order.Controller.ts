import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { orderService } from "./order.Service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../middleware/sendResponse";
import { paginationSystem } from "../../helper/pagination";

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


const adminOrderController = catchAsync(async (req: Request, res: Response) => {

    const status = req.query.status?.toString().toUpperCase() as any

    const result = await orderService.adminOrdersFromDB(status)

    const { data, limit, page, total, totalPage } = await paginationSystem(result, req)


    sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: "Orders retrieved successfully", data: data, meta: {limit, page, total, totalPage} })

})

const exportOrderController = catchAsync(async (req: Request, res: Response) => {

    const result = await orderService.exportOrderFromDB()
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Orders exported successfully", success: true, data: result })

})


const updateOrderController = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id
    const body = req.body

    const result = await orderService.updateOrderFromDB(body, id)

    sendResponse(res, { statusCode: StatusCodes.OK, message: "Order updated successfully", success: true, data: result })


})


export const orderController = { createOrderController, adminOrderController, myOrderController, exportOrderController, updateOrderController }