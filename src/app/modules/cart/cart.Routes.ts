import { Router } from "express";
import { cartController } from "./cart.Controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const route = Router()

route.post('/create', auth(Role.USER), cartController.createCartController)
route.get('/', auth(Role.USER), cartController.getMyCartController)
route.delete(`/:id`, auth(Role.USER), cartController.deleteCartController)

export const cartRoutes = route