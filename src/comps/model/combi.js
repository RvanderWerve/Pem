class Combi {//object representing a combination of filters. Filters exist of list of filters and the groupvalue
    constructor(nr, groupValue, filterList){
        this.nr = nr;
        this.groupValue = groupValue;
        this.filterList = filterList;//List of filter objects. Combining more filters in this list will narrow the result.
    }
}
export default Combi