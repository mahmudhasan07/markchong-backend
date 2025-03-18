"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const foods_Routes_1 = require("../modules/foods/foods.Routes");
const location_Routes_1 = require("../modules/location/location.Routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/users",
        component: user_routes_1.userRoutes
    },
    {
        path: "/auth",
        component: auth_routes_1.authRoutes
    },
    {
        path: "/foods",
        component: foods_Routes_1.foodRoutes
    },
    {
        path: "/location",
        component: location_Routes_1.locationRoutes
    },
];
routes.forEach(route => router.use(route.path, route.component));
exports.default = router;
