import React, {useEffect, useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import ScenarioListPage from "../controller/ScenarioListPage";
import AspectListPage from "../controller/AspectListPage";
import { Link } from "react-router-dom";
import useGetDceList from "../model/useGetDceList";
import NewDceForm from "../controller/NewDceForm";


export default function DceListPage({dceList}) { //Shows list of dce's with icons for editing, configuring aspects and delete.

    const [showNew, setShowNew] = useState(false);
    const [dceListChanged, setDceListChanged] = useState('');
    const [dceSelectEvent, setDceSelectEvent] = useState(null);
    const user = useContext(UserContext);
    const uid = user.uid;
    // const { dceNameList} = useShowDceList(uid, dceListChanged); 
    const [currentDce, setCurrentDce] = useState({});
    const [currentSc, setCurrentSc] = useState({});
    const [currentAsp, setCurrentAsp] = useState({});
    const [showScenarioOrAspect, setShowScenarioOrAspect] = useState(false)
    // const {dceNameEdit, dceFeatures, dceId, dceDetails} = useGetDceDetails(dceSelectEvent, uid);
    // dceList.list = useGetDceList(uid);
    dceList.list = useGetDceList(uid);
    const [listHtml, setListHtml] = useState([])
    console.log("dceList as prop: "+JSON.stringify(dceList.list));

useEffect(() => {
    let tempHtmlList = [];
    console.log("useEffect for list entered")
    dceList.list.length>0 && dceList.list.map((dce, i)=>{
        tempHtmlList.push(
            <div key={i} className="">
                <h5 className="mt-3"><li  className="listRuler mb-1"  data-id={dce.id}> <b>{dce.name}</b>
                <hr className="ruler"/> 
                <button className="btn btn-sm btn-outline-warning mx-1" onClick={()=>{setCurrentDce(dce);setCurrentSc({dummy: dce.id+currentSc.id});setShowScenarioOrAspect(true)}}><i className="material-icons mat-icon mt-1">edit</i></button>
                <hr className="rulerSm"/>
                {dce.grouped&&<button className="btn btn-sm btn-outline-danger mx-1" ><i className="material-icons mat-icon mt-1" onClick={()=>{setCurrentDce(dce);setCurrentAsp({dummy: dce.id+currentAsp.id});setShowScenarioOrAspect(false)}}>settings</i></button>}
                <hr className="rulerSm"/>
                <button className="btn  btn-outline-success btn-sm mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this DCE?')); dceList.deleteDce(dce); setDceListChanged(dce.id) } }><i className="material-icons mat-icon mt-1">delete_forever</i></button>
                </li></h5>
            </div>
    )
    })
setListHtml(tempHtmlList)    
    
}, [dceList.list, dceListChanged])


// shows or hide form for new DCE
const showNewDceForm = ()=>{
    if(showNew){
        setShowNew(false);
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
                 {listHtml}
            </ul>
            </div>
                <div className="row my-4">
                    <div className="col-auto  ">
                        <h4><u>Create new DCE</u></h4>
                        <div> <button className="btn btn-sm btn-outline-info" onClick={showNewDceForm}> new DCE</button>
                        </div>
                    {dceList.list.length>0 && showNew&&<NewDceForm showNewDceForm={showNewDceForm} dceList={dceList} setDceListChanged={setDceListChanged} setCurrentDce={setCurrentDce}/>}
                    </div>
                </div>
            </div>
{showScenarioOrAspect&&
                <div className="col scenarioContainer">
                    <ScenarioListPage currentDce={currentDce} dceId={currentDce.id} currentSc={currentSc} setCurrentSc={setCurrentSc}/>
                </div>}
                {!showScenarioOrAspect&&
                <div className="col scenarioContainer">
                    <AspectListPage currentDce={currentDce} dceId={currentDce.id} currentAsp={currentAsp} setCurrentDce={setCurrentDce} setCurrentAsp={setCurrentAsp}/>
                </div>}

        </div>

    </div>
    )
}
