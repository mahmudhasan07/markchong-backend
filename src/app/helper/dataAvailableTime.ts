import e from "express";

export const dataAvailableTime = () => {
    const date = new Date();

    const startTime = 12 * 60
    const endTime = 8 * 60
    const startDay = 1
    const endDay = 4




    const nowDay = date.getDay();
    const nowTime = date.getHours() * 60 + date.getMinutes();
    
    // console.log(nowDay);

    if (
        (nowDay > startDay && nowDay < endDay) ||  // Covers Tuesday and Wednesday (full days)
        (nowDay === startDay && nowTime >= startTime) || // Monday after 12 PM
        (nowDay === endDay && nowTime < endTime) // Thursday before 8 AM
    ) {
        return true
    }
    return false

}