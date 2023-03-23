import { parse } from 'node-html-parser';

async function getParsedElement({ html, querySelector }) {
    const root = parse(html);
    const ele = root.querySelector(querySelector);
    return ele;
}
async function parseAndGetElementAttribute({ html, querySelector, attr }) {
    const ele = await getParsedElement({ html, querySelector });
    return ele.getAttribute(attr);
}


async function parseAndGetElementTextContent({ html, querySelector }) {
    const root = parse(html);
    const ele = root.querySelector(querySelector);

    return ele.textContent;
}

const parseFn = { parseAndGetElementTextContent, parseAndGetElementAttribute };
export default parseFn;