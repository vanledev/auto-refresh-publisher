import fs from 'fs';
import regexFn from './regex.js';
import { decode, encode } from 'html-entities';

function appendCSV(data) {
  fs.appendFileSync('./data.csv', data);
}
function getWPPostIDs() {

  let postListRaw = fs.readFileSync(`${process.cwd()}/options/from-wordpress/wordpress-post-list.csv`, 'utf8').split('\r\n');
  const postList = postListRaw.filter(item => item !== '');
  return postList;
}

function getNeededCookiesFromHeader(cookiesFromHeader) {



  const cookies = cookiesFromHeader.map(item => item.split(';')[0]);
  return cookies.join(';');

}


function displayDateTime() {
  const nowInMinus11 = Date.now() - 18 * 60 * 60 * 1000;
  const dateObj = new Date(nowInMinus11);


  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  // console.log(date, month,year,hour,minute)
  return { date, month, year, hour, minute };
}

// console.log(getURLPrefix('http://benhvienyhoccotruyencantho.vn/H%E1%BB%8Fi%C4%90%C3%A1p/tabid/2485/ctl/Add_CauHoi/mid/7792/Default.aspx'));



const helpersFn = { getURLPrefix, getWPPostIDs, stripNonDigit, txtToArr, stripWrongHTMLEntities, getHomePage };
export default helpersFn;

