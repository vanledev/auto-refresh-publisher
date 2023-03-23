import pLimit from 'p-limit';


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayWrap({ ms, fn, arg }) {
    await delay(ms);
    return fn(arg);
}
async function runParallel({ func, argsObj, times, limit }) {
    async function funcAsync({ keywords, originString }) {
        return func({ keywords, originString });
    }

    const arr = [];
    for (let i = 0; i < times; i++) {


        const convertToPLimit = pLimit(limit);
        arr.push(convertToPLimit(() => funcAsync(argsObj)));
    }
    const statuses = await Promise.allSettled(arr);
    return statuses;
}

function getAllSettledValues(arr) {
    let res = arr.map(item => item.value);
    return res;

}
const promiseFn = { delay, delayWrap, runParallel, getAllSettledValues };
export default promiseFn;