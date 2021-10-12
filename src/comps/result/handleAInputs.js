//Handles input for aspects
const handleInputA = (e, currentName) => {
    const name = e.target.value;
    const nameList = [...currentName];
    nameList[0]=name;
    return ( 
        nameList
     );
}
 
export default handleInputA;