import crypto from 'crypto';



function getURLPrefix(url) {

    return regexFn.regexCaptureGroupItem({
        str: url,
        regex: /(.+)(\/Default)/,
        groupNumber: 1
    })


}
function replaceAt({ inputStr, originWordLength, index, replacement }) {
    const output = inputStr.substring(0, index) + replacement + inputStr.substring(index + originWordLength);

    return output;
}



function stripNonDigit(str) {
    const regex = /\D/g;
    const str2 = str.replace(regex, '')
    return str2;
}

function txtToArr(path) {
    const arr = fs.readFileSync(path, 'utf8').split('\r\n');
    const nonEmptyArr = arr.filter((item) => item)
    return nonEmptyArr
}

function regexCaptureGroupItem({ str, regex, groupNumber }) {
    const matches = str.match(regex);

    return matches[groupNumber];

}


function toMd5(str) {
    const hash = crypto.createHash('md5').update(str).digest('hex');
    return hash
}
function countWords(str) {
    return str.trim().split(/\s+/).length;
}

function sortWordsLengthDesc(arr) {
    arr.sort((a, b) => countWords(b) - countWords(a))
    return arr;
}
const textFn = { toMd5, countWords, sortWordsLengthDesc };
export default textFn;