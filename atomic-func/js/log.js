import { append } from 'domutils';
import fs from 'fs';
import csvFn from '../csv/crud.js';
const { writeMyCSV } = csvFn;

async function logError({ location, content }) {
    console.log(content + '\n');
    fs.appendFileSync(location, content + '\n');
}

function clearFile(path) {
    fs.closeSync(fs.openSync(path, 'w'));
}
// appendToCSV({ path: './test.csv', data: [{ 'name': 'van', 'age': 19 },{'name': 'lalala','age':3333}] })
async function appendToCSV({ path, data }) {
    let header = [];
    let obj;
    if (Array.isArray(data)) {
        obj = data[0];
    } else {
        obj = data;
    }
    const keys = Object.keys(obj);
    for (let key of keys) {
        header.push({ id: key, title: key })
    }
    let lines;
    if (Array.isArray(data)) {
        lines = data;
    } else {
        lines = [data];
    }
    const args = { path, obj: lines, header }

    const res = await writeMyCSV(args);
}

// clearCsvAndRewriteHeaders({ path: './naaaew.csv', headers: [1, 2, 3] })
async function clearCsvAndRewriteHeaders({ path, headers }) {
    clearFile(path);
    let obj = {};
    for (let header of headers) {
        obj[header] = header;
    }
    const res = await appendToCSV({ path, data: obj });
    if (res) { return };
}

const logFn = { logError, clearCsvAndRewriteHeaders, appendToCSV };
export default logFn;