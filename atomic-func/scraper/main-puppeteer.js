
const puppeteer = require('puppeteer');
const { clickTilNoMore, typingStuff } = require('./helpers');
const { login, saveCookies, useCookieToLogIn } = require('./auth')
const loginOptions = require('../options/login.json');


async function main() {
    const browser1 = await puppeteer.launch({ headless: false });
    const browser = await useCookieToLogIn(browser1, "./options/cookies.txt")
    const page = await browser.newPage();
    await page.goto(`https://m.facebook.com/po.trann/posts/3754174444711431`)
    await clickTilNoMore(page, '[data-sigil="ajaxify"]')
}

async function getLatestPost(url) {
    const browser = await launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = await page.evaluate(() => { return document.querySelector('.entry h2').textContent })
    const link = await page.evaluate(() => { return document.querySelector('.entry h2 a').getAttribute('href') })
    return { title, link }
}

