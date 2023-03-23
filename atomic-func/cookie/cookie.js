import fs from "fs";

// const str = await fs.promises.readFile(savinglocation, "utf8");
// let cookiesArr = JSON.parse(str);
async function importCookies(browser, cookiesArr) {
  const page = await browser.newPage();
  for (let cookie of cookiesArr) {
    page.setCookie(cookie);
  }
  return browser;
}

async function exportCookies(page) {
  const cookie = await page.cookies();
  return cookie;
}
// await fs.promises.writeFile(savinglocation, JSON.stringify(cookie));

function getNeededCookiesFromHeader(cookiesFromHeader) {
  const cookies = cookiesFromHeader.map((item) => item.split(";")[0]);

  // if (cookies[0].includes('JSESSIONID')){
  //     cookies.shift(cookies[0]);
  // }

  return cookies.join(";");
}

function retrieveSavedCookies(homepage) {
  const arr = JSON.parse(
    fs.readFileSync(getAppRoot() + `/liferay/cookies/${homepage}.txt`)
  );
  const obj = {};
  arr.forEach((item) => {
    obj[item[0]] = item[1];
  });
  return obj;
}

async function getCookiesString(cookies) {
  const arr = cookies.map((cookie) => `${cookie.name}=${cookie.value}`);
  return arr.join(";");
}
const cookieFn = { importCookies, exportCookies };

export default cookieFn;
