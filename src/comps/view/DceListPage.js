import React, {useEffect, useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import ScenarioListPage from "../controller/ScenarioListPage";
import AspectListPage from "../controller/AspectListPage";
import useGetDceList from "../model/useGetDceList";
import NewDceForm from "../controller/NewDceForm";


export default function DceListPage({dceList}) { //Shows list of dce's with icons and framework for editing, configuring aspects and delete, and creating a new dce.
    
    const [showNew, setShowNew] = useState(false);
    const [dceListChanged, setDceListChanged] = useState('');
    const user = useContext(UserContext);
    const uid = user.uid;
    const [currentDce, setCurrentDce] = useState({});
    const [currentSc, setCurrentSc] = useState({});
    const [currentAsp, setCurrentAsp] = useState({});
    const [showScenarioOrAspect, setShowScenarioOrAspect] = useState(true)
    dceList.list = useGetDceList(uid);//loads the list of dce's
    const [listHtml, setListHtml] = useState([])

    useEffect(() => {//React hook that provides html for the list. Re-rendered when list is changed
        let tempHtmlList = [];
        dceList.list.length>0 && dceList.list.forEach((dce, i)=>{
            tempHtmlList.push(
                <div key={i} className="">
                    <h5 className="mt-3"><li  className="listRuler mb-1"  data-id={dce.id}> <b>{dce.name}</b>
                        <hr className="ruler"/> 
                        <button className="btn btn-sm btn-outline-warning mx-1" onClick={()=>{setCurrentDce(dce);setCurrentSc({dummy: dce.id+currentSc.id});setShowScenarioOrAspect(true)}}><i className="material-icons mat-icon mt-1">edit</i></button>
                        <hr className="rulerSm"/>
                        {dce.grouped&&<button className="btn btn-sm btn-outline-danger mx-1" ><i className="material-icons mat-icon mt-1" onClick={()=>{setCurrentDce(dce);setCurrentAsp({dummy: dce.id+currentAsp.id});setShowScenarioOrAspect(false)}}>settings</i></button>}
                        <hr className="rulerSm"/>
                        <button className="btn  btn-outline-success btn-sm mx-1" onClick={() => { if (window.confirm('Are you sure you wish to delete this DCE?')){ dceList.deleteDce(dce); setDceListChanged(dce.id); setCurrentDce({dummy: dce.id}); setCurrentSc({dummy:"sc deleted"}); setCurrentAsp({dummy: 'asp deleted'}) }} }><i className="material-icons mat-icon mt-1">delete_forever</i></button>
                    </li></h5>
                </div>
            )
        })
        setListHtml(tempHtmlList)    
        
    }, [dceList.list, dceListChanged])


    // shows or hide form for new DCE
    const showNewDceForm = ()=>{
        setShowNew(!showNew);
    }

    //html to show in browser where either the aspectlist or the scenariolist is shown
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
                        {dceList.list && showNew&&<NewDceForm showNewDceForm={showNewDceForm} dceList={dceList} setDceListChanged={setDceListChanged}/>}
                        </div>
                    </div>
                </div>
                {showScenarioOrAspect&&<div className="col scenarioContainer">
                        <ScenarioListPage currentDce={currentDce} dceId={currentDce.id} currentSc={currentSc} setCurrentSc={setCurrentSc}/>
                </div>}
                {!showScenarioOrAspect&&<div className="col scenarioContainer">
                        <AspectListPage currentDce={currentDce} dceId={currentDce.id} currentAsp={currentAsp} setCurrentDce={setCurrentDce} setCurrentAsp={setCurrentAsp}/>
                </div>}
            </div>
        </div>
    )
}
