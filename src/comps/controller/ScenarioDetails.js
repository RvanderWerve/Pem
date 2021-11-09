import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import useScenarioDetailsHtml from "../view/useScenarioDetailsHtml";

export default function ScenarioDetails({currentDce, dceId, currentSc, setCurrentSc, scList, scProps, chosen, setChosen}) {
//Component for adding a new scenario

    const {scNr, setScNr,  handleAddScenario, setIsSaved, isSaved} = scProps;
    const user = useContext(UserContext);
    const uid = user.uid;


    //Handles choices from dropdown fValues
    const handleChosen = (value, name)=>{
        const tempSc = {...currentSc};
        tempSc.fValues[name]=value;
        setCurrentSc(tempSc);
        setIsSaved(false);
    }

    //Handles entries from input fields
    const handleEntry = (e)=>{
        e.preventDefault();
        const {name, value} = e.target;
        const tempSc = {...currentSc};
        tempSc[name]=value;
        setCurrentSc(tempSc);
        setIsSaved(false);
    }

//Gets features for the other scenario in a pair
const getAltFValues = (fValueList) =>{
    const groupFeat = currentDce.groupFeature;
    const groupFeatValue = fValueList[groupFeat];
    let newFeatValue;
    currentDce.features.forEach((feature) =>{
        if (feature.featureName===groupFeat){
            if(feature.featureValue1===groupFeatValue){
                newFeatValue = feature.featureValue2;}
            if(feature.featureValue2===groupFeatValue){
                newFeatValue = feature.featureValue1;}
        }
    })
    let altFValueList = {...fValueList};
    altFValueList[groupFeat] = newFeatValue;
    return altFValueList
}


//Saves via handleSave and creates the alternative scenario in case of grouped features
const handleCreateAlt = (e)=>{
    if(fieldsComplete()){
        console.log("fValues of currentSc: "+JSON.stringify(currentSc.fValues))
        console.log("currentSc.id: "+currentSc.id)
        let altFValues = getAltFValues(currentSc.fValues);
        console.log("altFValues after get: "+JSON.stringify(altFValues))
    handleAddScenario(altFValues, currentSc.id)
    .then((newId)=>{
        currentSc["altnr"] = newId;
        saveScenario(currentSc);
    })
    }
}

//Checks if all required field have an entry
const fieldsComplete = ()=>{
    let textOrImageComplete = false;
    let featuresComplete = false;
    if (currentSc["scText"].length!==0 || currentSc["scImg"].length!==0){
        textOrImageComplete=true}
    else{
    alert("Fill in the Scenario Text or upload a Scenario Image, or do both") 
    }
    featuresComplete= !currentDce.features.some(feature=>{
        if(currentSc["fValues"][feature.featureName].length===0){
            alert("Select a value for every feature in the scenario");
             
        } return (currentSc["fValues"][feature.featureName].length===0);
    })
return textOrImageComplete&&featuresComplete;    
}

 //Checks if all required field have an entry and saves to Firestore if ok.
 //Else alert with error message
const handleSave = async (e)=>{
e.preventDefault();
if(fieldsComplete()){
    saveScenario(currentSc);
    const altnr = currentSc["altnr"];
    console.log("altnr is: "+altnr)
    console.log("fValues i currentSc: "+JSON.stringify(currentSc["fValues"]))
    const altFValueList = getAltFValues(currentSc["fValues"]);
    console.log("altFValuesList in handlesave: "+JSON.stringify(altFValueList))
    if (altnr){ // if these is an altnr, there is a pair that needs to be updated, fValues only
        let scAltIndex = currentDce.scList.findIndex(sc=>sc.id===altnr);
        console.log("altIndex is: "+scAltIndex)
        console.log("altSc is: "+JSON.stringify(currentDce.scList[scAltIndex]))
        currentDce.scList[scAltIndex]["fValues"] = altFValueList; //update fValueList in paired scenario in scList
        let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
            response.doc(altnr.toString()).update({
                "fValues": altFValueList
            });//update fValueList in paired scenario in database
    }
setIsSaved(true);
}
}

const saveScenario = (scenario)=>{
    let scIndex = currentDce.scList.findIndex(sc=>sc.id===scenario.id);
    console.log("scIndex is: "+scIndex);
    currentDce.scList[scIndex] = scenario; //update scList with current scenario (save scenario)
    let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
    response.doc(currentSc.id.toString()).set(Object.assign({},scenario));//save scenario to database
}


//gets html for this page
const {scenarioHtml} = useScenarioDetailsHtml( currentDce, dceId, currentSc, setCurrentSc, scProps,  handleChosen, setChosen, handleSave, handleCreateAlt, handleEntry, chosen );

//Html to show in browser
    return (
        <div key="1">
         {scenarioHtml}
        </div>
    )
}
