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
  args: ["--start-maximized"],
});

browser = await cookieFn.importCookies(browser, cookiesArr);

let page = await browser.newPage();
page.setDefaultNavigationTimeout(120000);
await page.goto(process.env.URL, { waitUntil: "load" });
const buttonToClick = await page.waitForSelector(".articles-actions > button");
await page.addStyleTag({ path: "./style.css" });
await page.evaluate(() => {
  const body = document.querySelector("body");

  const extensionAlert = document.createElement("section");
  extensionAlert.innerHTML = `<div class="extension-alert">
<p class="extension-alert-text">Tự động Click "Làm Mới" đang: Bật</p>
<p class="extension-alert-count-wrapper">Đã tự động Click: <span class="extension-alert-count">0</span> lần </p>
</div>`;
  body.appendChild(extensionAlert);
  const countNode = document.querySelector(".extension-alert-count");

  let count = 0;
  function autoClickRefresh() {
    const buttonToClick = document.querySelector(".articles-actions > button");
    buttonToClick.click();
    count++;

    countNode.innerText = count;
    console.log(countNode.innerText, count);
  }
  autoClickRefresh();
  interval = setInterval(autoClickRefresh, 600000);
});

// const buttonToClick = await page.waitForSelector(".articles-actions > button");

// setInterval(() => {
//   buttonToClick.click();
// }, 600000);
