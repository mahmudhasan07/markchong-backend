import { Router } from "express";
import { locationController } from "./location.Controller";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";

const route = Router()

route.post('/create', auth(Role.ADMIN), locationController.createLocationController)

export const locationRoutes = route