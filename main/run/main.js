import cookieFn from "../../atomic-func/cookie/cookie.js";
import puppeteer from "puppeteer";
import fs from "fs";
import formFn from "../../atomic-func/scraper/form.js";
import * as dotenv from "dotenv";

dotenv.config();

const cookiesArr = JSON.parse(process.env.COOKIE).cookies;

console.log("Start opening browser, please wait...");
process.setMaxListeners(Infinity);

let browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});
browser = await cookieFn.importCookies(browser, cookiesArr);

let page = await browser.newPage();
page.setDefaultNavigationTimeout(120000);
await page.goto(process.env.URL, { waitUntil: "load" });

const buttonToClick = await page.waitForSelector(".articles-actions > button");

setInterval(() => {
  buttonToClick.click();
}, 1000);
