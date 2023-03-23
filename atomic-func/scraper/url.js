import regexFn from '../js/regex.js';
import fetch from 'node-fetch';
import request from 'request'
import axios from 'axios';



// fixHttp(`http://docutranhanh.com`);
// fixHttp('http://phimmoi.net');
async function fixHttp(url) {
    try {
        const res = await fetch(url, { timeout: 30000 });

        return { status: 'success', message: getHomePage(res.url) };
    } catch (e) {
        return { status: 'fail', message: e.message };

    }
}







// console.log(convertToHttps(`http://docutranhanh.com/page/Account/updateProfile`));
function convertToHttps(url) {
    const regex = /(http|https):\/\/(.+)/;
    const newurl = url.replace(regex, `https://$2`);
    return newurl;

}



function getDomain(url) {
    try {

        const matches = url.match(/(http|https):\/\/([^\/]+)\//);
        const homepage = matches[2];

        let deleteWww = homepage.replace('www.', '');

        return deleteWww;
    } catch (e) {
        console.log(`Lỗi khi getDomain của url ${url} - ${e.message}`)
        return undefined;

    }

}
function getHomePage(url) {

    try {
        const matches = url.match(/(http|https):\/\/([^\/]+)\//);

        const homepage = `${matches[1]}://${matches[2]}`;
        return homepage;

    } catch (e) {

        console.log(`Lỗi khi getHomepage của url ${url} - ${e.message}`)
        return undefined;

    }
}

// console.log(getURLPath(`mnphucthan.edu.vn/page/Account/updateProfile`));
function getURLPath(url) {
    let matches;
    if (url.includes('http') || url.includes('https')) {
        // console.log(url)
        matches = url.match(/(http|https):\/\/([^\/]+)(\/)(.+)/);
        // console.log(matches)
        const path = `${matches[4]}`;
        return path;

    } else {
        matches = url.match(/([^\/]+)(\/)(.+)/);
        // console.log(matches);
        const path = `${matches[3]}`;
        return path;

    }

}

function httpOrHttps(url) {
    const matches = url.match(/(http|https):\/\/(.+)/);
    return matches[1];

}
const urlFn = { fixHttp, httpOrHttps, getURLPath, getDomain, getHomePage, convertToHttps }
export default urlFn;