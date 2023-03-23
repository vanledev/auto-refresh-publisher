

function getCurrentDateTimeAsFileName() {
    const date = new Date().toLocaleString('en-GB');
    const regex = /\D/g;
    const formattedDate = date.replace(regex, '_');
    return formattedDate;
}

function displayDateTime() {
    const nowInMinus11 = Date.now() - 18 * 60 * 60 * 1000;
    const dateObj = new Date(nowInMinus11);


    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    // console.log(date, month,year,hour,minute)
    return { date, month, year, hour, minute };
}

async function limitTime(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('failure');
        }, ms)
    })
}

const timeFn = { getCurrentDateTimeAsFileName, displayDateTime, limitTime };



export default timeFn;

