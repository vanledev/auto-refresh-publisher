import fs from 'fs';

function readtxt(obj){
let obj2 = {};
Object.keys(obj).forEach(item=>{obj2[item] = fs.readFileSync(`${obj[item]}.txt`,'utf8').trim()});

return obj2;
}


export default readtxt;