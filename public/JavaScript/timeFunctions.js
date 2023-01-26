
//returns time in 12:00 format
function getTimeString(date)
{   
    return  get12HrTime(date.getHours()) + ":" + convertToTime(date.getMinutes())
}

//returns the seconds
function getSeconds(date)
{
    return convertToTime(date.getSeconds())
}

function getTimeOfDay(date)
{
    if (date.getHours() >= 12)
        return "pm"
    return "am"
}

//takes in 24 hour time and gives the 12 hour equivalent
function get12HrTime(time)
{
    if (time == 0)
        return 12
    else if (time > 12)
        return time - 12
    return time
}

// if the time is less that 10, a zero is added in front (ex: 8 -> 08)
function convertToTime(time)
{
    if (time < 10)
        return "0" + time
    return time
}