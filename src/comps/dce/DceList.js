import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import NewDce from "./NewDce";
import ScenarioList from "./ScenarioList";
import { Link } from "react-router-dom";
import useShowDceList from "./useShowDceList";
import useGetDceDetails from "./useGetDceDetails";


export default function DceList() { //Shows list of dce's with icons for editing, configuring aspects and delete.

    const [showNew, setShowNew] = useState(false);
    const [dceListChanged, setDceListChanged] = useState('');
    const [dceSelectEvent, setDceSelectEvent] = useState(null);
    const user = useContext(UserContext);
    const uid = user.uid;
    const {dceHtml, dceNameList} = useShowDceList(uid, dceListChanged); 
    const {dceNameEdit, dceFeatures, dceId, dceDetails} = useGetDceDetails(dceSelectEvent, uid);


//delete a dce from database and refresh list
const deleteDce = (e) => {
    let dce;
    if(e.target.parentElement.parentElement.getAttribute('data-id')){
        dce = e.target.parentElement.parentElement.getAttribute('data-id');
    } else{
        dce = e.target.parentElement.getAttribute('data-id');
    }    
    pemFirestore.collection('users').doc(uid).collection('DceList').doc(dce).delete()
    .then(() => { console.log("Document with ID"+dce+ "  successfully deleted!");
                setDceListChanged(dce); })
    .catch((error) => { console.error("Error removing document: ", error); });
}

// shows or hide form for new DCE
const showNewDceForm = ()=>{
    if(showNew){
        setShowNew(false)
    }
    else if(!showNew){
        setShowNew(true)
    }
}

  //html to show in browser
    return (
    <div>
        <div className="row my-4">
            <div className="listContainer col col-12 col-sm-3">
             <div className=" col-auto ">
             <h4><u>DCE list</u></h4>
             <ul>
                {dceHtml && dceHtml.map((dce, i)=>{
                    return(
                        <div key={i} className="">
                            <h5 className="mt-3"><li  className="listRuler mb-1"  data-id={dce.id}> <b>{dce.name.dceName}</b>
                            <hr className="ruler"/> 
                            <button className="btn btn-sm btn-outline-warning mx-1" onClick={e=>{setDceSelectEvent(e)}}><i className="material-icons mat-icon mt-1">edit</i></button>
                            <hr className="rulerSm"/>
                             {dce.grouped&&<Link to={{pathname:"/aspectList/"+uid+"/"+ dce.id, dceFeatures: dce.features, groupFeature: dce.groupFeature, dceNameEdit: dceNameEdit}}>
                                <button className="btn btn-sm btn-outline-danger mx-1" ><i className="material-icons mat-icon mt-1">settings</i></button>
                              </Link>}
                            <hr className="rulerSm"/>
                            <button className="btn  btn-outline-success btn-sm mx-1" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this DCE?')) deleteDce(e) } }><i className="material-icons mat-icon mt-1">delete_forever</i></button>
                            </li></h5>
                        </div>
                )
                })
                }
            </ul>
            </div>
                <div className="row my-4">
                    <div className="col-auto  ">
                        <h4><u>Create new DCE</u></h4>
                        <div> <button className="btn btn-sm btn-outline-info" onClick={showNewDceForm}> new DCE</button>
                        </div>
                    {showNew&&<NewDce showNewDceForm={showNewDceForm} setDceListChanged={setDceListChanged} dceNameList={dceNameList} />}
                    </div>
                </div>
            </div>

                <div className="col scenarioContainer">
                    <ScenarioList dceNameEdit = {dceNameEdit} dceId={dceId} dceFeatures={dceFeatures}  dceDetails={dceDetails}/>
                </div>
        </div>

    </div>
    )
}
