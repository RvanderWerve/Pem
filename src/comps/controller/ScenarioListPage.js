import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../model/firebase/config";
import ScenarioDetails from "./ScenarioDetails";
import { Link } from "react-router-dom";
import Scenario from "../model/scenario";


export default function ScenarioListPage({currentDce, dceId, currentSc, setCurrentSc}) {//Creates list of scenario's incl frame for details

    const user = useContext(UserContext);
    const uid = user.uid;
    const [isSaved, setIsSaved] = useState(false);
    const [scListHtml, setScListHtml] = useState([]);
    const [refreshScListFlag, setRefreshScListFlag] = useState('');


    // Adds scenario with id which is the first available unique number 
    // Features are taken from dce
    const handleAddScenario = async( altFValues, altnr) =>{
        if(dceId){
            let fValues ={};
            currentDce.features.forEach(feature=>{
                fValues[feature.featureName]="";
                })
            currentDce.scList.sort(function(a, b){return (a.id-b.id)});//first sort list so no nr will be missed
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
            if (altnr){// if altnr was specified, the new sc will be the pair of this alt sc
                altSc = true; 
                fValues= {...altFValues}
                } 
            let newScDetails = {id: seqNr, altnr: altnr, altSc: altSc, fValues, scText: "", scImg: "", scExpl: ""}
            let response2 = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
            response2.doc(seqNr.toString()).set(newScDetails);
            let newSc = new Scenario(seqNr, "", "", "", fValues, altSc, altnr||null);//create new scenario object with empty values, including altnr if available
            currentDce.scList.push(newSc);
            currentDce.scList.sort(function(a, b){return (a.id-b.id)});//sort list again so new sc is ordered too
            setIsSaved(false);
            setRefreshScListFlag("added"+seqNr)
            setCurrentSc(newSc);//show the new scenario
            return newSc.id;
        }
    }

    //delete scenario from database and refresh list
    const deleteSc = (sc) => {
        let scId = sc.id;
        let scIndex = currentDce.scList.findIndex(sc=>sc.id===scId);
        let altScNr = currentDce.scList[scIndex].altnr//define altnr if available
        currentDce.scList.splice(scIndex, 1); //delete scenario from scList
        pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(scId.toString()).delete()//delete from db
        .then(() => {
            console.log("Scenario with ID "+scId+ "  successfully deleted!");
            if (scId===currentSc.id){ //if deleted sc was shown on screen, clear it
                setCurrentSc({dummy: currentSc.id});
            }
            setIsSaved(false);
            setRefreshScListFlag("deleted"+scId)
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        if (altScNr){ // if there is a pair scenario coupled to this scenario (altScNr), delete that too
            let altScIndex = currentDce.scList.findIndex(sc=>sc.id===altScNr);
            altScIndex>-1&&currentDce.scList.splice(altScIndex, 1); //delete pair scenario from scList
            pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(altScNr.toString()).delete()
            .then(() => {
                console.log("Alt scenario with ID "+altScNr.toString()+ "  successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    useEffect(()=>{//react hook for creating html to display scenario list. 
        let tempHtmlList = [];
        currentDce.scList && currentDce.scList.forEach((sc,i)=>{
            tempHtmlList.push(
                <div  key={i} className="">
                    <h5 className="mt-3"><li className="listRuler mb-1" data-id={sc.id}><button className="btn btn-sm btn-outline-info" onClick={()=>{setCurrentSc({dummy:"clear"+i});setCurrentSc(sc); setIsSaved(false)}}>{sc.id}</button>
                    <hr className="ruler"/> 
                    <button className="btn  btn-outline-warning btn-sm mx-2" onClick={()=>{setCurrentSc({dummy:"clear"+i});setCurrentSc(sc); setIsSaved(false)}} > <i className="material-icons mat-icon">edit</i></button>
                    <hr className="rulerSm"/>
                    <button className="btn  btn-outline-success btn-sm mx-2" onClick={() => { if (window.confirm('Are you sure you wish to delete this scenario?'))deleteSc(sc) }} > <i className="material-icons mat-icon">delete_forever</i></button></li></h5>
                </div>
            )
        })
        setScListHtml(tempHtmlList)    

    },[refreshScListFlag, currentSc])//Re-rendered upon change of flag and current sc


    //html to show in browser including the header and framework for the details
    return (
        <div>
            <h4><u>Details</u> for <b> {currentDce&&currentDce.name}{!currentDce.name&&<span> - Select a dce</span>}</b>{currentSc.id&&<span> - Scenario nr. {currentSc.id}</span>}{!currentSc.id&&<span> - Select a scenario nr.</span>}</h4>
            <div className="">
                 <h6>{currentDce&&currentDce.id&&<span> <Link to={{pathname:"/app/"+uid+"/"+ currentDce.id}}>
                        <button className="btn btn-sm btn-outline-info mx-1" ><i className="material-icons mat-icon mt-1">play_circle_outline</i></button>
                     </Link></span>}
                {currentDce&&currentDce.id&&<span> Play this DCE</span>} {currentDce&&currentDce.id&&<span> <hr className="ruler detailsRuler"/> <button className="btn btn-sm btn-outline-info" onClick={() => {let clipText = window.location.href+"app/"+uid+"/"+ currentDce.id; navigator.clipboard.writeText(clipText)}}>Copy DCE link </button></span>} </h6>
            </div>
            <div className="pb-4"><h6> {currentDce&&currentDce.grouped&&<span>Group feature: {currentDce&&currentDce.groupFeature}</span>} {<span> <hr className="ruler detailsRuler"/> Questions in DCE: {currentDce&&currentDce.nrQuestions}</span>}</h6>
            </div>
            <div className="row">
                <div className="scenarioList col col-6 col-md-3 col-sm-5">
                    <h5>Scenario's</h5>
                    <ul>
                        <li key="header" className="listRuler mb-1">Nr.  <hr className="ruler"/> Edit <hr className="rulerSm"/>&nbsp;Delete </li>
                            {scListHtml}
                            {currentDce&&<li className="mb-2"><button className="btn btn-sm btn-outline-info" onClick={()=>{handleAddScenario(null, null)}} >Add scenario</button></li>}
                    </ul>
                </div>
                <div className="col">
                    <ScenarioDetails currentDce={currentDce} dceId={dceId} currentSc={currentSc} setCurrentSc={setCurrentSc}  handleAddScenario={handleAddScenario} setIsSaved={setIsSaved} isSaved={isSaved}/>
                </div>
            </div>
        </div>
    )
}
