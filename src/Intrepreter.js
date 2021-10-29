const readFile = require("./readFile");
function intrepreter(fileAdress){
    var ali = "";
    readFile(fileAdress).then(function(e){
        ali = e.split(/\r?\n/);
    });
    return ali;
}
module.exports = intrepreter;