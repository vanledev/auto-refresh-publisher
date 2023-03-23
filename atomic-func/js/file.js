import fs from 'fs';
import path from 'path';
import getAppRoot from '../../get-app-root.js'


// concatAllInFolders({
//     foldersArr: [`${getAppRoot()}/atomic-func/html-parser`],
//     inputFileExt: 'css|js',
//     outputFile: `${getAppRoot()}/html-parser.js`
// })

function concatAllInFolders({ foldersArr, inputFileExt, outputFile, }) {
    const files = listFilesInManyFolders(foldersArr);
    const output = createOrClearFile(outputFile);
    let returnData = '';
    for (let file of files) {

        if (path.extname(file) == `.` + inputFileExt) {
            const content = fs.readFileSync(file, { encoding: 'utf-8' })
            fs.appendFileSync(output, content)
            returnData += content;
        }

    }
    return returnData
}
// console.log(listFilesInManyFolders([`${getAppRoot()}/atomic-func/csv`, `${getAppRoot()}/atomic-func/html-parser`]));
function listFilesInManyFolders(foldersPaths) {
    function listFiles(folder) {
        let arr = [];
        const files = fs.readdirSync(folder);
        const notFolder = files.filter((file) => {
            const isNotFolder = path.extname(folder + '/' + file) !== '';

            return isNotFolder;
        });

        notFolder.forEach(file => {
            arr.push(folder + '/' + file);
        });

        return arr;

    }
    const arr = foldersPaths.filter((folder) =>
        fs.existsSync(folder)).map((folder) => listFiles(folder)).flat();
    return arr;
}

// createOrClearFolder(`${getAppRoot()}/pdf/1`);
function createOrClearFolder(path) {
    fs.rmSync(path, { recursive: true, force: true });
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) throw err;
    });
}
// createOrClearFile(`${getAppRoot()}/1.txt`);
function createOrClearFile(path) {
    fs.openSync(path, 'w');
    return path;
}
const fileFn = { concatAllInFolders, listFilesInManyFolders, createOrClearFolder, createOrClearFile, };
export default fileFn;