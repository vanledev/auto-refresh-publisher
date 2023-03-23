import { dirname } from 'path';
import { fileURLToPath } from 'url';


import { parse } from 'csv-parse';

import * as XLSX from 'xlsx/xlsx.mjs';
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

import path from 'path';
import read from 'fs-readdir-recursive';
import replaceExt from 'replace-ext';


async function convertRecursiveToCSV({ folder, exclude, ext }) {
    const files = read(folder, function (name, index, dir) {
        return !dir.includes(exclude)
    });

    files.forEach((file) => {

        if (path.extname(file) == '.xlsx') {

            sheetToCsv({ inputFile: `${folder}/${file}`, outputFile: replaceExt(`${folder}/${file}`, '.csv') });
        }

    })
}



// sheetToCsv({
//     inputFile: './options/spin/test.xlsx',
//     outputFile: './options/spin/test.csv'
// })
function sheetToCsv({ inputFile, outputFile }) {
    const worksheet = XLSX.readFile(inputFile);
    XLSX.writeFile(worksheet, outputFile, { bookType: "csv" });
    return;
}

async function writeMyCSV({ path, obj, header }) {
    // const obj = [
    //     {name: 'Bob',  lang: 'ko'},
    //     {name: 'Mary', lang: 'English'}
    // ];
    // const path = './test.csv';
    // const header =  [
    //     {id: 'name', title: 'NAME'},
    //     {id: 'lang', title: 'LANGUAGE'}
    // ]

    const csvWriter = createCsvWriter({ path, header, append: true });

    await csvWriter.writeRecords(obj)
    // console.log("Written")   
    return 1;
}


// const x = await csvFn.readMyCSV({
//     headers: ['i'],
//     isSkipFirstLine: true,
//     path: '1.csv'
// })
// console.log(x)
async function readMyCSV({ headers, path, isSkipFirstLine }) {

    const from_line = isSkipFirstLine ? 2 : 1;
    const processFile = async () => {
        const records = [];
        const parser = fs
            .createReadStream(path)
            .pipe(parse({
                // CSV options if any
                columns: headers,
                from_line,
                skip_empty_lines: true,
                skip_lines_with_empty_values: true,
                skip_lines_with_error: true,
                relax_column_count: true,
                trim: true
            }));
        for await (const record of parser) {
            // Work with each record
            records.push(record);
        }
        return records;
    };
    const records = await processFile();
    return records;
    // console.info(records);



}

const csvFn = { convertRecursiveToCSV, writeMyCSV, readMyCSV };




export default csvFn;