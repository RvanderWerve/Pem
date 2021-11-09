import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import ScenarioDetails from "./ScenarioDetails";
import { Link } from "react-router-dom";
import useGetScList from "../model/useGetScList";
import Scenario from "../model/scenario";


export default function ScenarioListPage({currentDce, dceId, currentSc, setCurrentSc}) {//Creates list of scenario's incl frame for details

    const user = useContext(UserContext);
    const uid = user.uid;
    const [chosen, setChosen] = useState([{nr: 0}]);
    const [scListChanged, setScListChanged] = useState(''); // requires unique content each time list needs refresh
    const [scNr, setScNr] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    // currentDce.scList = useGetScList(uid, dceId, scListChanged)


    //show scenario list when dceId is changed
    useEffect(() => {
            setChosen([{}]);
            setScNr(null);
            setIsSaved(false)
      }, [dceId])

// Adds scenario with id which is first available unique number 
// Features are taken from dce
    const handleAddScenario = async( altFValues, altnr) =>{
        if(dceId){
            let fValues ={};
            currentDce.features.forEach(feature=>{
                fValues[feature.featureName]="";
            })
        let seqNr=1; // set seqNr to 1 and check if it is available, otherwise raise by 1 and repeat
        currentDce.scList.forEach(sc => {
            if(sc.id!==seqNr){
                return;
            }
            else {
                seqNr +=1;
            }
            });
            let altSc = false;
            if (altnr){altSc = true; fValues= {...altFValues}} // if altnr was specified, the new sc will be the pair of this alt sc
            console.log("altFValues: "+JSON.stringify(altFValues))
            let newScDetails = {id: seqNr, altnr: altnr, altSc: altSc, fValues, scText: "", scImg: "", scExpl: ""}
            let response2 = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
            console.log("newScDetails: "+JSON.stringify(newScDetails));
            response2.doc(seqNr.toString()).set(newScDetails);
            let newSc = new Scenario(seqNr, "", "", "", fValues, altSc, altnr||null);
            console.log("newSc: "+JSON.stringify(newSc));
            currentDce.scList.push(newSc);
            setIsSaved(false);
            setCurrentSc(newSc);
            setScListChanged(seqNr.toString()+'created');
      return newSc.id;
    }
}

//delete scenario from database and refresh list
const deleteSc = (sc) => {
    let scId = sc.id;
    console.log("scId to be deleted: "+JSON.stringify(scId))
    let scIndex = currentDce.scList.findIndex(sc=>sc.id===scId);
    let altScNr = currentDce.scList[scIndex].altnr
    console.log("scIndx "+scIndex)
    currentDce.scList.splice(scIndex, 1); //delete scenario from scList
    console.log("scList: "+JSON.stringify(currentDce.scList))
    pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(scId.toString()).delete()
    .then(() => {
        console.log("Scenario with ID "+scId+ "  successfully deleted!");
        if (scId===currentSc.id){ //if deleted sc was shown on screen, clear it
            setCurrentSc({dummy: currentSc.id});
        }
        setScListChanged(scId+'deleted'); //set trigger to refresh list of scenario's
        setIsSaved(false);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    if (altScNr){ // if there is a pair scenario coupled to this scenario (altScNr), delete that too
        let altScIndex = currentDce.scList.findIndex(sc=>sc.id===altScNr);
        altScIndex&&currentDce.scList.splice(altScIndex, 1); //delete pair scenario from scList
        pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(altScNr.toString()).delete().then(() => {
            console.log("Alt scenario with ID "+altScNr.toString()+ "  successfully deleted!");
            setScListChanged(altScNr+'deleted'); //set trigger to refresh list of scenario's
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });}
}


const scProps = {scNr, setScNr, handleAddScenario,  setIsSaved, isSaved}


    //html to show in browser
    return (
        <div>
            <h4><u>Details</u> for <b> {currentDce&&currentDce.name}</b>{currentSc.id&&<span> - Scenario nr. {currentSc.id}</span>}{!currentSc.id&&<span> - Select a scenario nr.</span>}</h4>
            <div className="">
            <h6>{currentDce&&<span> <Link to={{pathname:"/app/"+uid+"/"+ currentDce.id}}>
                    <button className="btn btn-sm btn-outline-info mx-1" ><i className="material-icons mat-icon mt-1">play_circle_outline</i></button>
                    </Link></span>}
                    {currentDce&&<span> Play this DCE</span>} {currentDce&&<span> <hr className="ruler detailsRuler"/> <button className="btn btn-sm btn-outline-info" onClick={() => {let clipText = window.location.href+"app/"+uid+"/"+ currentDce.id; navigator.clipboard.writeText(clipText)}}>Copy DCE link </button></span>} </h6></div>
           <div className="pb-4"><h6> {currentDce&&currentDce.grouped&&<span>Group feature: {currentDce&&currentDce.groupFeature}</span>} {<span> <hr className="ruler detailsRuler"/> Questions in DCE: {currentDce&&currentDce.nrQuestions}</span>}</h6>
           </div>
            <div className="row">
   <div className="scenarioList col col-6 col-md-3 col-sm-5">
    <h5>Scenario's</h5>
    <ul>
    <li key="header" className="listRuler mb-1">Nr.  <hr className="ruler"/> Edit <hr className="rulerSm"/>&nbsp;Delete </li>
                {currentDce.scList && currentDce.scList.map((sc,i)=>{
                return(
                    <div  key={i} className="">
                    <h5 className="mt-3"><li className="listRuler mb-1" data-id={sc.id}><button className="btn btn-sm btn-outline-info" onClick={()=>{setCurrentSc({dummy:"clear"+i});setCurrentSc(sc)}}>{sc.id}</button>
                    <hr className="ruler"/> 
                    <button className="btn  btn-outline-warning btn-sm mx-2" onClick={()=>{setCurrentSc({dummy:"clear"+i});setCurrentSc(sc)}} > <i className="material-icons mat-icon">edit</i></button>
                    <hr className="rulerSm"/>
                    <button className="btn  btn-outline-success btn-sm mx-2" onClick={() => { if (window.confirm('Are you sure you wish to delete this scenario?'))deleteSc(sc) }} > <i className="material-icons mat-icon">delete_forever</i></button></li></h5>
                    </div>
                )
                })
            }
           {currentDce&&<li className="mb-2"><button className="btn btn-sm btn-outline-info" onClick={()=>{handleAddScenario(null, null)}} >Add scenario</button></li>}
    </ul>
    </div>
    
    <div className="col">
        <ScenarioDetails currentDce={currentDce} dceId={dceId} currentSc={currentSc} setCurrentSc={setCurrentSc} scList={currentDce.scList} scProps={scProps} chosen={chosen} setChosen={setChosen}/>
    </div>
    </div>
        </div>
    )
}
