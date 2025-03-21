import e from "express";

export const dataAvailableTime = (startday : number, starttime : number, endday : number, endtime : number) => {
    const date = new Date();

    const startTime = starttime * 60
    const endTime = endtime * 60
    const startDay = startday 
    const endDay = endday

    const nowDay = date.getDay();
    const nowTime = date.getHours() * 60 + date.getMinutes();

    if (
        (nowDay > startDay && nowDay < endDay) ||  // Covers Tuesday and Wednesday (full days)
        (nowDay === startDay && nowTime >= startTime) || // Monday after 12 PM
        (nowDay === endDay && nowTime < endTime) // Thursday before 8 AM
    ) {
        return true
    }
    return false

}