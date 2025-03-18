import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "@prisma/client";
import { foodController } from "./foods.Controller";
import validateRequest from "../../middleware/validateRequest";
import { foodValidation } from "./foods.Validation";
import { fileUploader } from "../../helper/uploadFile";

const route = Router()

route.post('/create', auth(Role.ADMIN), fileUploader.uploadFoodImages, validateRequest(foodValidation.addFoodValidation), foodController.addFoodController)
route.get('/', auth(), foodController.getAllFoodController)
route.get(`/:id`, auth(), foodController.getSingleFoodController)
route.delete(`/:id`, auth(Role.ADMIN), foodController.deleteFoodController)
route.patch(`/:id`, auth(Role.ADMIN), fileUploader.uploadFoodImages, validateRequest(foodValidation.updateFoodValidation), foodController.updateFoodController) 

export const foodRoutes = route