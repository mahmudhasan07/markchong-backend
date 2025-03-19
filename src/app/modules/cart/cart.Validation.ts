import { z } from "zod";

export const cartValidation = z.object({
    foodId: z.string({ required_error: "Food id is required" }),
    quantity: z.number({ required_error: "Quantity is required" }),
    price: z.number({ required_error: "Price is required" }),
})
