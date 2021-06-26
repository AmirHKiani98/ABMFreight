const request = require("./request");
module.exports = readFile;

function readFile(fileAddress) {
    return request(fileAddress, {
        responseType: 'text',
    })
}