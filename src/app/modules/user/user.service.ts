import { PrismaClient, User } from "@prisma/client";
import ApiError from "../../error/ApiErrors";
import { StatusCodes } from "http-status-codes";
import { compare, hash } from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { OTPFn } from "../../helper/OTPFn";
import OTPVerify from "../../helper/OTPVerify";
import { jwtHelpers } from "../../helper/jwtHelper";
import { access } from "fs";

const prisma = new PrismaClient();

const createUserIntoDB = async (payload: User) => {

    const findUser = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })
    if (findUser) {
        throw new ApiError(StatusCodes.CONFLICT, "User already exists")
    }

    const newPass = await hash(payload.password, 10)

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: newPass,
            status: "ACTIVE"
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    })
    // OTPFn(payload.email)

    const token = jwtHelpers.generateToken({ email: payload.email, id: result.id, role: result.role }, { expiresIn: "24hr" })

    return { result, accessToken: token }
}


const passwordChangeIntoDB = async (payload: any, token: string) => {

    const userInfo = token && jwt.decode(token) as { id: string, email: string }

    const findUser = await prisma.user.findUnique({
        where: {
            email: userInfo && userInfo?.email
        }
    })
    if (!findUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User is not exists")
    }

    const comparePass = await compare(payload.oldPassword, findUser.password)

    if (!comparePass) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Old password is incorrect")
    }

    const newPass = await hash(payload.password, 10)
    const result = await prisma.user.update({
        where: {
            email: userInfo && userInfo?.email
        },
        data: {
            password: newPass
        }
    })

    return result
}

const updateUserIntoDB = async (id: string, payload: any) => {

    try {
        const update = await prisma.user.update({
            where: {
                id
            },
            data: {
                ...payload,
            }
        })

        return update

    } catch (error) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User not found")
    }
}


const meFromDB = async (id: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id : true,
            name: true,
            email: true,
            pushNotification: true,
            orderReminder: true,
            weaklyUpdate: true,
        }
    })

    return user

}


export const userServices = { createUserIntoDB, passwordChangeIntoDB, updateUserIntoDB, meFromDB }