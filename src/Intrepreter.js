const readFile = require("./readFile");
const createProjector = require("./pointToMapCoordinates");
function intrepreter(mainFileAddress, bondFileAddress){
    readFile(fileAdress).then(function(e){
        let lines = e.split(/\r?\n/);
        let projector = createProjector(bondFileAddress);
        let reg1 = RegExp('(?<action>[a-zA-Z_]+)\s+(?<type>[a-zA-Z_]+)\s+(?<data>{(?<inner_data>(\s)?(?<index>[a-zA-Z_]+):\s(?<value>[a-zA-Z_0-9\.]+)(,)?)+})', "gm");
    });
}
module.exports = intrepreter;