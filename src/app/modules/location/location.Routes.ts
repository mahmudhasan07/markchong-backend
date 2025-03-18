import { Router } from "express";
import { locationController } from "./location.Controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const route = Router()

route.post('/create', auth(Role.ADMIN), locationController.createLocationController)

route.get('/', auth(), locationController.getAllLocationController)

route.delete(`/:id`, auth(Role.ADMIN), locationController.deleteLocationController)

export const locationRoutes = route