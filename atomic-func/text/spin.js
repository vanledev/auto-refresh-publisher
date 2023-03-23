import mathFn from '../js/math.js';
import fs from 'fs';
import textFn from '../text/text.js';
import globalVars from '../../global-variables.js';
import arrFn from '../js/arr.js';
import csvFn from '../csv/crud.js';
import Case from 'case';
import { parse } from 'node-html-parser';
import { decode } from 'html-entities';
import pLimit from 'p-limit';


async function createAndWriteManyArticleVariants({ articles, wordSets }) {
    const arr = [];
    const convertToPlimit = pLimit(1);
    for (let i = 0; i < articles.length; i++) {
        const promise = convertToPlimit(() => createAndWriteOneArticleVariants({ wordSets, article: articles[i] }));
        arr.push(promise);
    }

    const allSettled = await Promise.allSettled(arr);

    return allSettled;
}
async function createAndWriteOneArticleVariants({ wordSets, article }) {
    fs.mkdir(`${globalVars.getAppRoot()}/spin-result/${article.id}`, { recursive: true }, (err) => {
        if (err) throw err;
    });
    let arr = [];

    for (let i = 0; i < article.quantity; i++) {
        let promise = new Promise(async (resolve, reject) => {
            let articleContent = await fs.promises.readFile(`${globalVars.getAppRoot()}/options/from-wordpress/posts/${article.id}-content.txt`, 'utf8', (err) => { if (err) throw err });
            let articleTitle = await fs.promises.readFile(`${globalVars.getAppRoot()}/options/from-wordpress/posts/${article.id}-title.txt`, 'utf8', (err) => { if (err) throw err });

            for (let item of [{ fileContent: articleContent, fileTitle: "content" }, { fileContent: articleTitle, fileTitle: "title" }]) {
                let spinned = await spinManySynonymSets({ wordSets, originString: item.fileContent });
                if (item.fileTitle === 'content') {
                    spinned = await wrapLinkToAllSets(spinned);
                    const linkPoolStr = await getLinkPoolHrefStr();
                    spinned += linkPoolStr;
                }

                await fs.promises.writeFile(`${globalVars.getAppRoot()}/spin-result/${article.id}/${i + 1}-${item.fileTitle}.txt`, spinned, (err) => {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                })
                // console.log("hey")

            }
            resolve()

        })
        arr.push(promise);
    }
    const allSettled = await Promise.allSettled(arr);

    console.log(`Đã spin xong ${article.quantity} bản cho bài viết ${article.id}`);
    return allSettled;

};
async function spinManySynonymSets({ wordSets, originString }) {
    const spinned = wordSets.reduce(
        (inputText, theSet) => {
            const res = spinASynonymSet({
                words: theSet.words,
                originString: inputText,
                howManyBlacklistWords: theSet.howManyBlacklistWords
            })
            return res;
        }, originString
    )

    return spinned;

}

function spinASynonymSet({ words, howManyBlacklistWords, originString }) {
    let spinnedStr = '';
    const synonymsStr = words.join('|');

    const regex = new RegExp(`(?<=[^\\w\\u00C0-\\u1EF9\<\/]|^)(${synonymsStr})(?=[^\\w\\u00C0-\\u1EF9\>]|$)`, 'giu');

    spinnedStr = originString.replace(regex, (match) => {
        const wordCase = Case.of(match) || 'capital';
        let replacement = '';
        replacement = Case[wordCase](words[mathFn.getRandomInRange(howManyBlacklistWords, words.length - 1)]);
        return replacement;
    }
    )


    return spinnedStr;


}



async function wrapLinkToAllSets(originString) {
    const sets = await getKeywordAndLinkSets();

    for (let i = 0; i < sets.length; i++) {

        const res = await wrapLinkToOneKeywordSet(originString, sets[i]);

        originString = res;

    }

    return originString;


}
async function wrapLinkToOneKeywordSet(originString, keywordSet) {
    // console.log(keywordSet)
    for (let i = 0; i < keywordSet.length; i++) {
        const regex = new RegExp(`(?<=[^\\w\\u00C0-\\u1EF9\<\/]|^)(${keywordSet[i].word})(?=[^\\w\\u00C0-\\u1EF9\>]|$)`, 'iu');

        const div = parse(originString);

        let isRunningRecursive = true;

        runThroughAllDescendants(div);
        function runThroughAllDescendants(node) {

            if (node.childNodes.length == 0) {
                const oldText = node.textContent;
                const match = oldText.match(regex);

                if (match !== null) {

                    const newText = oldText.replace(regex, (match) => {
                        let replacement = `<a href="${keywordSet[i].url}">${match}</a>`;

                        return replacement;
                    }

                    )

                    node.textContent = newText;
                    isRunningRecursive = false;
                    return;
                }


            }

            for (let i = 0; i < node.childNodes.length; i++) {
                if (isRunningRecursive) {
                    let child = node.childNodes[i];
                    runThroughAllDescendants(child);
                }

            }

        }
        if (!isRunningRecursive) {

            const str = decode(div.outerHTML);

            return str;
        }

    }

    return originString;
}




async function getKeywordAndLinkSets() {
    const CSVLines = await csvFn.readMyCSV({
        path: `${globalVars.getAppRoot()}/options/link-of-keyword.csv`,
        headers: ['groupID', 'words', 'url'],
        isSkipFirstLine: true
    })

    const singleKeywords = CSVLines.map((obj) => {
        const keywords = spinSyntaxToArr(obj.words);
        let arr = [];
        for (let word of keywords) {
            arr.push({
                groupID: obj.groupID,
                word,
                url: obj.url
            })
        }
        return arr;
    })
    const arr2 = arrFn.removeDuplicateObjValue(singleKeywords.flat(), 'word');
    const uniqueKeys = arrFn.getUniqueKeys(arr2, 'groupID');
    const arr3 = []
    for (let key of uniqueKeys) {
        const sameIDobjs = arr2.filter((item) => item.groupID === key);
        const sorted = sameIDobjs.sort((a, b) => textFn.countWords(b.word) - textFn.countWords(a.word));
        arr3.push(sorted);
    }

    return arr3;
}

async function getLinkPoolHrefStr() {
    const numOfLinksFromPoolCSVLines = await csvFn.readMyCSV({
        path: `${globalVars.getAppRoot()}/options/links-pool/number.csv`,
        headers: ['num'],
        isSkipFirstLine: true
    })
    const numOfLinksFromPool = numOfLinksFromPoolCSVLines[0].num;

    const poolCSVLines = await csvFn.readMyCSV({
        path: `${globalVars.getAppRoot()}/options/links-pool/all-links.csv`,
        headers: ['url'],
        isSkipFirstLine: true
    })
    const pool = poolCSVLines.map((item) => item.url);

    const randomSetFromPool = mathFn.getRandomSet(pool, numOfLinksFromPool)

    const str = randomSetFromPool.map((item) => `<a href="${item}">${item}</a><br/>`).join('');

    return `<p>Nguồn tham khảo:</p>` + str;
}


function spinSyntaxToArr(str) {
    const words = str.replace(/\{|\}/g, '').split('|').map((item) => item.trim());
    const nonempty = words.filter((item) => {
        if (item) {
            return true;
        }
    }
    );

    return nonempty;
}
const spinFn = { spinSyntaxToArr, spinManySynonymSets, createAndWriteManyArticleVariants, spinASynonymSet, createAndWriteOneArticleVariants };
export default spinFn;