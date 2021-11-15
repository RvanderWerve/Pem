import React, { useState } from "react";


export default function NewAspect({addAspect}) {
  //component with form for creating new aspect

    const [aspectName, setAspectName] = useState(['name']);
    const [aspectDescr, setAspectDescr] = useState(['descr']);

 
  //Saves aspect with name and description
    const saveAspect = (e)=>{
        e.preventDefault();
        addAspect( aspectName[0], aspectDescr[0]);        
  }

    // sets new name
    const handleNameInputChange = (e) => {
      const nameList = handleInputA(e, aspectName)
        setAspectName(nameList);
    }

    // sets new description 
    const handleDescrInputChange = (e) => {
      const descrList = handleInputA(e, aspectDescr);
      setAspectDescr(descrList);
  }

  //common method for changing name and description
  const handleInputA = (e, currentName) => {
    const name = e.target.value;
    const nameList = [...currentName];
    nameList[0]=name;
    return ( 
        nameList
     );
}
 
  //html to show in browser. Form for entering name and description
  return (
        <div>
            <form className="form-inline">
                <div className="form-floating">
                    <input type="text" className="form-control" name="aspectName"  placeholder="Aspect name" id="aspectName" 
                    required onChange={handleNameInputChange}></input>
                    <label htmlFor="aspectName" className="block">Name: </label>
                    </div>
                    <div className="form-floating">
                    <textarea type="text" rows="7" className="form-control" name="aspectDescr"  placeholder="Description" id="aspectDescr" 
                    required onChange={handleDescrInputChange}></textarea>
                    <label htmlFor="aspectDescr" className="block">Description: </label>
                    </div>
      <button className="btn btn-sm btn-outline-success" onClick={saveAspect} >Save aspect</button>
          </form>
        </div>
    )
}
