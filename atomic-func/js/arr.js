function removeDuplicateObjValue(arr, key) {
    const arr2 = arr.filter((obj, index, arr) =>
        index === arr.findIndex((ele) => (
            ele[key].toLowerCase() === obj[key].toLowerCase()
        ))
    )
    return arr2;
}
function getUniqueKeys(arr, key) {
    return [...new Set(arr.map(item => item[key]))];

}

function txtToArr(path) {
    const arr = fs.readFileSync(path, 'utf8').split('\r\n');
    const nonEmptyArr = arr.filter((item) => item)
    return nonEmptyArr
}

const arrFn = { removeDuplicateObjValue, getUniqueKeys };
export default arrFn;