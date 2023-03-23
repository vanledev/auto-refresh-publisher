import fs from 'fs';
import regexFn from '../text/regex.js';
import fetch from 'node-fetch';
import globalVars from '../../global-variables.js';
import timeFn from '../js/time.js'
import logFn from '../js/log.js'
import helpers from './helpers.js';
import csvFn from '../csv/crud.js';
import helpersJS from '../js/helpers.js';


// console.log( helpersJS.getURLPrefix(`http://benhvienyhoccotruyencantho.vn/H%E1%BB%8Fi%C4%90%C3%A1p/tabid/2485/ctl/Add_CauHoi/mid/7792/Default.aspx`));
main()

async function main() {
    const errorFileName = timeFn.getCurrentDateTimeAsFileName();
    const sites = fs.readFileSync(`${globalVars.getAppRoot()}/options/target-sites.csv`,'utf8').split('\r\n');
    

    let sitesRemain = sites.length;
    let totalPosts = parseInt(fs.readFileSync(`${globalVars.getAppRoot()}/options/how-many-url.txt`, 'utf8'));

    for (let url of sites) {
        const lastPostID = await getLastPostID(errorFileName, url, totalPosts);

        if (done) {
            sitesRemain--;


            if (sitesRemain == 0) {
                console.log("Done pasting all URLs from all sites.")
                return 1;
            }
        }

    }


}

async function getLastPostID(errorFileName, url, totalPosts) {

    try {
       
       
    const res = await fetch(`${url}`);
    const text = await res.text();
    const link = await helpers.getElementHref({text, selector: 'a[id$="hplChiTiet_0"]'});
    
    const lastPostID = regexFn.regexCaptureGroupItem({
        str: link, regex: /(ch=)(\d+)/, groupNumber: 2
    });
    return (lastPostID);
    }

    catch (e) {

        logFn.logError({ location: `${globalVars.getAppRoot()}/log/get-urls/${errorFileName}.txt`, content: `${url} - Site down or wrong link. - ${e}` });
    }
}


async function getPostName({prefix, postID}){
    
    let url = `${prefix}/Default.aspx?tabid=120&ch=${postID}`;
    

const res = await fetch(url)    ;
const html = await res.text();
const title = await helpers.getElementText({text: html, selector: '[id$="TieuDe"]' });

return title;


}



function getBlogUrls() {
    const sites = getTargetSitesURL();
    const regex = /(.+)\?/;

    const blogPages = sites.map(site => site.match(regex)[1])
    return blogPages;
}

function calTotalPages(totalPosts) {
    const total = Math.ceil(totalPosts / 20);

    return total
}

async function appendToFile(errorFileName, targetSiteUrl, sliced) {
    let row = '';
    for (arr of sliced) {
        let noCommaTitle = arr[0].replace(/[^\u00C0-\u1EF9\w\d\s]/g, ' ');
        let str = noCommaTitle + ',' + arr[1] + "\r\n";

        row += str;

    }
    try {
        await promises.appendFile(`./url/${errorFileName}.csv`, row);
        return 1;
    } catch (err) {

        console.log(err)
    }
}




