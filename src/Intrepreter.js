const readFile = require("./readFile");
const createProjector = require("./pointToMapCoordinates");
const Agent = require("./agents/Agent");
function intrepreter(mainFileAddress, bondFileAddress, graph){
    readFile(mainFileAddress).then(function(e){
        let lines = e.split(/\r?\n/);
        let projector = createProjector(bondFileAddress);
        let agents = [];
        for (let i = 0; i < lines.length; i++) {
            const element = lines[i];
            let reg1 = /(?<action>[a-zA-Z_]+)\s+(?<type>[a-zA-Z_]+)\s+(?<data>{(?<inner_data>(\s)?(?<index>[a-zA-Z_]+):\s(?<value>[a-zA-Z_0-9\.]+)(,)?)+})/gm;
            let matches = reg1.exec(element);
            if(matches){
                let action = matches.groups.action;
                if(action == "add_agent"){
                    let type = matches.groups.type;
                    // ToDo-check the types
                    let data = matches.groups.data;
                    let reg2 = /(?<inner_data>(\s)?(?<index>[a-zA-Z_]+):\s(?<value>[a-zA-Z_0-9\.]+))/gm;
                    let tempData = [...data.matchAll(reg2)];
                    let agent = new Agent(type);
                    for (let j = 0; j < tempData.length; j++) {
                        const element2 = tempData[j];
                        let tempIndex = element2.groups.index;
                        let tempValue = element2.groups.value;
                        agent.addData(tempIndex, tempValue);
                    }
                    agents.push(agent);
                }
            }
        }
        console.log(agents)

    });
}
// intrepreter("E:\Scripts\Github\FABMPackages\visualizer\tempFiles\test.txt")

// let reg1 = /(?<inner_data>(\s)?(?<index>[a-zA-Z_]+):\s(?<value>[a-zA-Z_0-9\.]+))/gm;
// let text = `add_agent driver {start_lon: 51.28954274125356, start_lan: 35.71774139394975, start_lat: 51.34205089081785, end_lat: 35.74243011411434, speed: 13.9}\nadd_agent driver {start_lon: 51.338238002409696, start_lan: 35.6838421704837, start_lat: 51.35018025666922, end_lat: 35.68584351582838, speed: 13.9}`
// let lines = text.split(/\r?\n/);
// let match = [...lines[0].matchAll(reg1)];
// console.log(match);
module.exports = intrepreter;