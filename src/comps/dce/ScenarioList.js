import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import NewScenario from "./NewScenario";
import { Link } from "react-router-dom";
import useShowScList from "./useShowScList";


export default function ScenarioList({dceNameEdit, dceId, dceFeatures, dceDetails}) {//Creates list of scenario's incl frame for details

    const user = useContext(UserContext);
    const uid = user.uid;
    const [chosen, setChosen] = useState([{nr: 0}]);
    const [scListChanged, setScListChanged] = useState(''); // requires unique content each time list needs refresh
    const [scNr, setScNr] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const {scList} = useShowScList(uid, dceId, scListChanged)


    //show scenario list when dceId is changed
    useEffect(() => {
            setChosen([{}]);
            setScNr(null);
            setIsSaved(false)
      }, [dceId])

// Adds scenario with id which is first available unique number 
// Features are taken from dce
    const handleAddScenario = async(altnr) =>{
        if(dceId){
            const fValues ={};
            dceFeatures.forEach(feature=>{
                fValues[feature.featureName]="";
            })
            let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').orderBy('data.nr');
        let data =  await response.get();
        let seqNr=1; // set seqNr to 1 and check if it is available, otherwise raise by 1 and repeat
        data.docs.forEach(doc => {
            if(doc.data().data.nr!==seqNr){
                return;
            }
            else {
                seqNr +=1;
            }
            });
            let altSc = false;
            if (altnr){altSc = true} // if altnr was specified, the new sc will be the pair of this alt sc
            setChosen([{}]);
            const detailData = {data: {nr: seqNr, altnr: altnr, altSc: altSc, fValues, scText: "", scImg: "", scExpl: ""}};
            let response2 = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
            response2.doc(seqNr.toString()).set(detailData);
            setChosen([detailData]);
            setScNr(seqNr);
            setIsSaved(false);
            setScListChanged(seqNr.toString()+'created');
      return seqNr;
    }
}

//delete scenario from database and refresh list
const deleteSc = (e) => {
    let sc;
    if(e.target.parentElement.parentElement.getAttribute('data-id')){
    sc = e.target.parentElement.parentElement.getAttribute('data-id');
    } else{
        sc = e.target.parentElement.getAttribute('data-id');
    }
    let altSc = scList.find(scx=>scx.id===sc).data.altnr;
    pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(sc).delete()
    .then(() => {
        console.log("Scenario with ID "+sc+ "  successfully deleted!");
        if (sc===scNr){ //if deleted sc was shown on screen, clear it
            setScNr("");
            setChosen([{}]);
        }
        setScListChanged(sc+'deleted'); //set trigger to refresh list of scenario's
        setIsSaved(false);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    if (altSc){ // if there is a pair scenario coupled to this scenario (altSc), delete that too
    pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(altSc.toString()).delete().then(() => {
        console.log("Alt scenario with ID "+altSc.toString()+ "  successfully deleted!");
        setScListChanged(altSc+'deleted');
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });}
}

//select scenario to show and edit details 
const editSc = (e) => {
    setChosen([{}]);
    let sc;
    if(e.target.parentElement.parentElement.getAttribute('data-id')){
    sc = e.target.parentElement.parentElement.getAttribute('data-id');
    } else{
        sc = e.target.parentElement.getAttribute('data-id');
    }
    setScNr(sc);
    pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(sc).get()
.then((doc)=>{
    let data = doc.data();
    setChosen([data]);
    setIsSaved(false);
 }).catch((err)=>{
    console.log('Error with loading scenario'+err);
})
}

const dceProps = {dceId, dceFeatures, dceDetails};
const scProps = {scNr, setScNr, chosen, setChosen, handleAddScenario, setIsSaved, isSaved}


    //html to show in browser
    return (
        <div>
            <h4><u>Details</u> for <b> {dceNameEdit}</b>{scNr&&<span> - Scenario nr. {scNr}</span>}{!scNr&&<span> - Select a scenario nr.</span>}</h4>
            <div className="">
            <h6>{dceDetails&&dceId&&<span> <Link to={{pathname:"/app/"+uid+"/"+ dceId}}>
                    <button className="btn btn-sm btn-outline-info mx-1" ><i className="material-icons mat-icon mt-1">play_circle_outline</i></button>
                    </Link></span>}
                    {dceDetails&&dceId&&<span> Play this DCE</span>} {dceDetails&&dceId&& <span> <hr className="ruler detailsRuler"/> <button className="btn btn-sm btn-outline-info" onClick={() => {let clipText = window.location.href+"app/"+uid+"/"+ dceId; navigator.clipboard.writeText(clipText)}}>Copy DCE link </button></span>} </h6></div>
           <div className="pb-4"><h6> {dceDetails.details&&dceDetails.details.grouped&&<span>Group feature: {dceDetails.details.groupFeature}</span>} {dceDetails.details&& <span> <hr className="ruler detailsRuler"/> Questions in DCE: {dceDetails.details.nrQuestions}</span>}</h6>
           </div>
            <div className="row">
   <div className="scenarioList col col-6 col-md-3 col-sm-5">
    <h5>Scenario's</h5>
    <ul>
    <li key="header" className="listRuler mb-1">Nr.  <hr className="ruler"/> Edit <hr className="rulerSm"/>&nbsp;Delete </li>
                {scList && scList.map((sc,i)=>{
                return(
                    <div  key={i} className="">
                    <h5 className="mt-3"><li className="listRuler mb-1" data-id={sc.id}><button className="btn btn-sm btn-outline-info" onClick={editSc}>{sc.data.nr}</button>
                    <hr className="ruler"/> 
                    <button className="btn  btn-outline-warning btn-sm mx-2" onClick={editSc} > <i className="material-icons mat-icon">edit</i></button>
                    <hr className="rulerSm"/>
                    <button className="btn  btn-outline-success btn-sm mx-2" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this scenario?')) deleteSc(e) }} > <i className="material-icons mat-icon">delete_forever</i></button></li></h5>
                    </div>
                )
                })
            }
           {dceId&&<li className="mb-2"><button className="btn btn-sm btn-outline-info" onClick={()=>handleAddScenario(null)}>Add scenario</button></li>}
    </ul>
    </div>
    
    <div className="col">
        <NewScenario dceProps={dceProps} scProps={scProps}/>
    </div>
    </div>
        </div>
    )
}
