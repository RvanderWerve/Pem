class Aspect {//object representing an aspect. An aspect is used as a filterfunction on the results.
    constructor(id, name, descr, ageGender, combiList) {
        this.id = id;
        this.name = name;
        this.descr = descr;
        this.ageGender = ageGender;//filtering can also be done on age and gender of the participants via the ageGender object
        this.combiList = combiList;//the combiList is a list(array) of filters that are combined with eachother (results added)
    }
}
export default Aspect