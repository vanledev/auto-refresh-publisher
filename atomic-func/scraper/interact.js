import fs from 'fs';
import globalVars from '../../global-variables.js';


async function typingStuff(page, elementHandle, text) {

    await elementHandle.focus();
    await page.keyboard.down("ControlLeft");
    await page.keyboard.press("A");
    await page.keyboard.up("ControlLeft");
    await elementHandle.type(text);

}
async function copyingStuff(page, elementHandle) {
    await elementHandle.focus();
    await page.keyboard.down("ControlLeft");
    await page.keyboard.press("A");
    await page.keyboard.press("C");
    await page.keyboard.up("ControlLeft");

}
async function clickTilNoMore(page, selector) {
    let prev = await page.$$(selector)
    while (prev.length > 0) {
        for (x of prev) {
            await x.click();
        }
        prev = await page.$$(selector)

    }

}

function getLastFrame() {
    const iframes = [...document.querySelectorAll("iframe")];
    const count = iframes.length;
    const last = iframes[count - 1];
    return last;
}



const interactFn = { };
export default interactFn;