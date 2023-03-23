import cheerio from 'cheerio';
import { encode, decode } from 'html-entities';

async function getElementHref({ text, selector }) {
    const $ = cheerio.load(text);
    const cheerioElement = $(selector);
    return cheerioElement.attr('href');


}


function stripWrongHTMLEntities(str) {
    const regex = /&.*?;/g;

    const matches = str.match(regex);
    let uniqueItems = [...new Set(matches)];

    if (uniqueItems.length === 0) {
        return str;
    }
    for (let entity of uniqueItems) {
        const regex = new RegExp(`${entity}`, 'g');

        str = str.replace(regex, decode(entity));
    }

    return str;

}


function getHomePage(url) {
    try {
        const matches = url.match(/(http|https):\/\/([^\/]+)\//);

        const domain = matches[2];
        let deleteWww = domain.replace('www.', '');

        return deleteWww;
    } catch (e) {
        return '';

    }

}

async function getElementText({ text, selector }) {
    const $ = cheerio.load(text);
    const cheerioElement = $(selector);
    return cheerioElement.text();


}

async function getDocTitle(text) {
    const $ = cheerio.load(text);
    const cheerioElement = $('title');
    return cheerioElement.text();


}

function getTitleAndHref(text) {
    const $ = load(text);
    const cheerioElements = $('.entry-content .entry-title a');
    let arr = []
    cheerioElements.each((index, ele) => {
        let title = $(ele).text();
        let href = $(ele).attr('href')

        regex = /(.+)(\?)/;
        let href2 = href.match(regex)[1]

        regex2 = /(.+)(\;jsessionid)/
        if (href2.includes('jsessionid')) {
            href2 = href2.match(regex2)[1];
        }


        arr.push([title, href2])
    });
    return arr;

}


const helpers = { getHomePage, stripWrongHTMLEntities, getElementHref, getElementText, getDocTitle };
export default helpers;