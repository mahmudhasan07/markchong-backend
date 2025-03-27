import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { orderController } from "./order.Controller";

const route = Router()


route.post('/create', auth(Role.USER), orderController.createOrderController)

route.get('/my-order', auth(Role.USER), orderController.myOrderController)

route.get('/', auth(Role.ADMIN), orderController.adminOrderController)

route.get("/exports",  orderController.exportOrderController)
route.get("/location/:id", auth(Role.ADMIN), orderController.getLocationOrderController)

route.put(`/update`, auth(Role.ADMIN), orderController.updateOrderController)

export const orderRoutes = route