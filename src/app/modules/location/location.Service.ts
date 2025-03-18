import { prisma } from "../../../utils/prisma"

const createLocationFormDB = async (payload: any) => {
    const result = await prisma.location.create({ data: payload })
    return result
}

const getAllLocationFromDB = async () => {
    const result = await prisma.location.findMany({})
    return result
}

const deleteLocationFromDB = async (id: string) => {
    const result = await prisma.location.delete({ where: { id } })
    return result
}

export const locationService = { createLocationFormDB, getAllLocationFromDB, deleteLocationFromDB }