class Agent {
  constructor(agentType, agentName, data) {
    this.agentType = agentType;
    this.agentName = agentName;
    if (!data) {
      this.data = {};
    } else {
      this.data = data;
    }
  }
  addData(index, value) {
    this.data[index] = value;
  }
  modifyData(data) {
    this.data = data;
  }
  // ToDo - Complete removeData
  removeData(index) {}
}
module.exports = Agent;
