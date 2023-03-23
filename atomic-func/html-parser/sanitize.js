import * as cheerio from 'cheerio';
import fs from 'fs';
import globalVars from '../../global-variables.js';

function sanitize({ text, domainsArr }) {
    const linksStripped = stripLinksKeepContent({ text, domainsArr });
    const rawURLsStripped = stripRawURLs({ text: linksStripped, domainsArr });

    return rawURLsStripped;
}

function stripLinksKeepContent({ text, domainsArr }) {
    const domainsRegexStr = domainsArr.join('|');
    const regex = new RegExp(`${domainsRegexStr}`, 'gi');
    const $ = cheerio.load(text);
    $('a').each(function () {
        if ($(this).attr("href").search(regex) > -1) {
            $(this).attr("href", '#');
        }
    });
    return $('body').html();

}

function stripRawURLs({ text, domainsArr }) {

    const domainsStr = domainsArr.join('|');
    const regex = new RegExp(`(?<=\\s|^)(\\S*?)(${domainsStr})(\\S*?)(?=\\s|$)`, 'gi');
    const $ = cheerio.load(text);
    $("*").contents().filter((i, node) => {
        return node.nodeType === 3
    }
    ).each((i, node) => {
        const oldData = node.data;
        const newData = oldData.replace(regex, '');
        node.data = newData
    })
    return $('body').html()
}




export default sanitize;
