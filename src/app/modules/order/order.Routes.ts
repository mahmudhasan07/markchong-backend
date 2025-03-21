import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { orderController } from "./order.Controller";

const route = Router()


route.post('/create', auth(Role.USER), orderController.createOrderController)

route.get('/my-order', auth(Role.USER), orderController.myOrderController)

route.get('/', auth(Role.ADMIN), orderController.todayOrderController)

route.get("/exports", auth(Role.ADMIN), orderController.exportOrderController)

route.put(`/:id`, auth(Role.ADMIN), orderController.updateOrderController)

export const orderRoutes = route