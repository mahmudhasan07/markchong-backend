import { Router } from "express"
import { userRoutes } from "../modules/user/user.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { foodRoutes } from "../modules/foods/foods.Routes"
import { locationRoutes } from "../modules/location/location.Routes"
import { cartRoutes } from "../modules/cart/cart.Routes"
import { orderRoutes } from "../modules/order/order.Routes"
import { NotificationsRouters } from "../modules/notifications/notification.routes"

const router = Router()
const routes = [
    {
        path: "/users",
        component: userRoutes
    },
    {
        path: "/auth",
        component: authRoutes
    },
    {
        path: "/foods",
        component: foodRoutes
    },
    {
        path: "/location",
        component: locationRoutes
    },
    {
        path: "/cart",
        component: cartRoutes
    },
    {
        path: "/order",
        component: orderRoutes
    },
    {
        path: "/notification",
        component: NotificationsRouters
    },
]

routes.forEach(route => router.use(route.path, route.component))
export default router 