import Dce from "./dce";

class GroupedDce extends Dce{//object representing a grouped dce. This is a dce where each scenario is paired with one specific other scenario
    constructor(id, name, descr, nrQuestions, features, grouped, groupFeature, uid) {
        super(id, name, descr, nrQuestions,  features, grouped, uid);//takes general params from Dce
        this.groupFeature = groupFeature; //In a groupedDce, one feature is defined as groupFeature. This is the only feature that has a different value in a scenario pair 
    }
}
export default GroupedDce