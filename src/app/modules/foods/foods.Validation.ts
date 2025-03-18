import { z } from "zod";

const addFoodValidation =  z.object({
    name : z.string({required_error : "Name is required"}),
    description : z.string({required_error : "Description is required"}),
    price : z.number({required_error : "Price is required"}),
    image : z.string({required_error : "Image is required"}).optional(),
    day : z.string({required_error : "Day is required"}),
})


const updateFoodValidation =  z.object({
    name : z.string({required_error : "Name is required"}).optional(),
    description : z.string({required_error : "Description is required"}).optional(),
    price : z.number({required_error : "Price is required"}).optional(),
    image : z.string({required_error : "Image is required"}).optional(),
    day : z.string({required_error : "Day is required"}).optional(),
})

export const foodValidation = {addFoodValidation, updateFoodValidation }