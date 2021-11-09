class GroupedScenario extends Scenario {
    constructor(id, scText, scExpl, scImg, fValues, altSc, altnr){
        super(id, scText, scExpl, scImg, fValues);
        this.altSc = altSc;
        this.altnr = altnr;
    }
}
export default GroupedScenario