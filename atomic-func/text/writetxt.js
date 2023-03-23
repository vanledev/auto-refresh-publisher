import helpers from "../html-parser/helpers.js";
import fs from 'fs';
import promiseFn from "../js/promise.js";
import { resolve } from "path";
const { delay } = promiseFn;
async function writeTxt({ path, text }) {
    const promise = new Promise((res, rej) => {
        fs.writeFile(path, helpers.stripWrongHTMLEntities(text), (err) => {
            if (err) {
                rej(err.message)
            }
            res('The file has been saved!');
        });


    });

    return promise;
}

const writetxtFn = { writeTxt };
export default writetxtFn;