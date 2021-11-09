import React, { useState } from "react";
import { pemFirestore } from "../../firebase/config";
import { useParams} from "react-router-dom";


export default function NewAspect({addAspect}) {
  //Form for creating a new aspect

    const [aspectName, setAspectName] = useState(['name']);
    const [aspectDescr, setAspectDescr] = useState(['descr']);
    const {userId, dceId } = useParams();

 
  //Save aspect if all fields are filled in
    const saveAspect = (e)=>{
        e.preventDefault();
        addAspect( aspectName[0], aspectDescr[0]);        
  }

    // handle name input change
    const handleNameInputChange = (e) => {
      const nameList = handleInputA(e, aspectName)
        setAspectName(nameList);
    }

    // handle descr input change
    const handleDescrInputChange = (e) => {
      const descrList = handleInputA(e, aspectDescr);
      setAspectDescr(descrList);
  }

  const handleInputA = (e, currentName) => {
    const name = e.target.value;
    const nameList = [...currentName];
    nameList[0]=name;
    return ( 
        nameList
     );
}
 
  //html to show in browser
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
