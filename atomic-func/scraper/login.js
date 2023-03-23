
async function getCookiesString(cookies) {
    const arr = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
    return arr.join(';')

}



function getNeededCookiesFromResponse(res, neededCookiesPropertiesAsRegex) {
    const regex = neededCookiesPropertiesAsRegex;
    const cookies = res.headers.raw()['set-cookie'];
    // console.log(cookies);
    const cookie2 = cookies.map(item => item.split(';')[0]);
    const cookie3 = cookie2.map(item => item.split('='))
    const cookie4 = cookie3.filter(item => regex.test(item[0]))
    // console.log(cookie4);
    if (cookie4.length == 0) {
        return undefined;
    }
    return cookie4[0][1];

}
function getNeededCookiesFromHeaders({ headers, neededCookiesProperties }) {
    const cookies = headers['set-cookie'];

    const cookie2 = cookies.map(item => item.split(';')[0]);
    const cookie3 = cookie2.map(item => item.split('='))
    const cookie4 = cookie3.filter(item => neededCookiesProperties.includes(item[0]))
    return cookie4[0][1];

}

async function collectCookies({ page, location }) {
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    cookie = await page.cookies();
    writeFileSync(location, JSON.stringify(cookie));
}

async function saveCookies(page, savinglocation) {

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    const cookie = await page.cookies();
    await fs.promises.writeFile(savinglocation, JSON.stringify(cookie));

}

function retrieveSavedCookies(homepage) {
    const arr = JSON.parse(readFileSync(globalVars.getAppRoot() + `/liferay/cookies/${homepage}.txt`))
    const obj = {}
    arr.forEach(item => {
        obj[item[0]] = item[1]
    })
    return obj;

}

async function useCookieToLogIn(browser, savinglocation) {


    const str = await fs.promises.readFile(savinglocation, 'utf8');
    const cookiesArr = JSON.parse(str);
    const page = await browser.newPage();
    for (let cookie of cookiesArr) {

        page.setCookie(cookie);

    }

    return browser;

}

async function login(page, obj) {

    await page.goto(obj.loginURL);
    const login = await page.waitForSelector(obj.loginElement);
    const password = await page.waitForSelector(obj.passwordElement);
    const submitButton = await page.waitForSelector(obj.submitElement);
    await typingStuff(page, login, obj.login)
    await typingStuff(page, password, obj.password)
    await submitButton.click();
    return 1;
}


async function isSiteUp(url) {
    try {

        const res = await fetch(url);

        if (res.status === 200) {


            return true;
        } else {


            return false;
        }
    } catch (e) {


        return false;

    }
}



async function onSucessRedirect(page) {
    page.on('response', async (res) => {

        if (res.request().method() == 'POST') {
            console.log(res.request().method());
            if (res.status() == 302) {


            }
        }


    });

}

const loginFn = { getNeededCookiesFromHeaders, retrieveSavedCookies, useCookieToLogIn, login, saveCookies, getNeededCookiesFromResponse };
export default loginFn;