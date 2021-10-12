//Handles dce inputs from form
const handleInputD = (e,currentList, currentName) => {
    const name = e.target.value;
    const nameList = [...currentList];
    nameList[0][currentName]=name;
    return ( 
        nameList
     );
}
 
export default handleInputD;