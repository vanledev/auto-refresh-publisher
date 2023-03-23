import fs from 'fs';

function readtxt2(obj) {
    let obj2 = {};
    Object.keys(obj).forEach(item => { obj2[item] = fs.readFileSync(`${obj[item]}.txt`, 'utf8').trim() });

    return obj2;
}

function readtxt(path) {
    return fs.readFileSync(path, 'utf8');
}
export default readtxt;