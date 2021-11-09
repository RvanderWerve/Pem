class Dce {//object representing a discrete choice experiment, 
    constructor(id, name, descr, nrQuestions, features, grouped) {
        this.id = id;
        this.name = name;//name of the dce. Must be unique.
        this.descr = descr;//description of this dce. Will be shown to participants
        this.nrQuestions = nrQuestions;//nr of questions that the particpants will have to answer in this dce
        this.features = features;//list of features on which a value has to be defined on each scenario
        this.grouped = grouped;
        this.scList = [];//list of scenario object that make up the dce
        this.aspectList = [];//list of aspects that are used to filter the results
    }
}
export default Dce