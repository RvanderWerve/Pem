import React, { useState } from "react";
import { pemFirestore } from "../../firebase/config";
import { useParams} from "react-router-dom";
import handleInputA from "./handleAInputs";


export default function NewAspect({ setShowAspectsFlag, showNewAspectForm}) {
  //Form for creating a new aspect

    const [aspectName, setAspectName] = useState(['name']);
    const [aspectDescr, setAspectDescr] = useState(['descr']);
    const {userId, dceId } = useParams();

 
  //Save aspect if all fields are filled in
    const saveAspect = (e)=>{
        e.preventDefault();
        let aspectColl = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
        aspectColl.add( {aspectName: aspectName[0], aspectDescr: aspectDescr[0]})
        .then((docRef)=>{
              console.log("Document written with ID: ", docRef.id);
              aspectColl.doc(docRef.id).collection('Combis').doc('0').set({nr: 0, groupValue: "", filters: []})
              setShowAspectsFlag("new aspect saved id "+docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
        showNewAspectForm();
    
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
