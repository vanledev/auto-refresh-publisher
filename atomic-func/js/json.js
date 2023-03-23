
function jsonParseSafely(str) {
    // xóa quote bao quanh string và đổi single quote sang double quote cho đúng chuẩn JSON
    if (str[0] == '"' || str[0] == "'") {
        str = str.slice(1, str.length - 2)
    }
    str = str.replace(/'/g, '"');
    const json = JSON.parse(str);
    return json;
}
const jsonFn = { jsonParseSafely };
export default jsonFn;