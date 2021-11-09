    class Scenario {//object representing a scenario. 
    constructor(id, scText, scExpl, scImg, fValues, altSc, altnr){
        this.id = id;
        this.scText = scText;//text that is displayed as part of a scenario. Either a scText or a scImg must be entered before running a dce.
        this.scExpl = scExpl;//text that serves as addition explanation in a scenario
        this.scImg = scImg;//textfield representing a link to an uploaded image.
        this.fValues = fValues;//list of feature values. All features of the dce must have a value here before dce can be run.
        this.altSc = altSc;//boolean representing whether this scenario is the first one of a pair, or the alternative (the second) scenario
        this.altnr = altnr; //number that matches the id of the scenario to which it is paired
    }
}
export default Scenario