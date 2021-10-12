import React, { useContext } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import useNewScenarioHtml from "./useNewScenarioHtml";

export default function NewScenario({dceProps, scProps}) {
//Component for adding a new scenario

    const {dceId, dceFeatures, dceDetails} = dceProps;
    const {scNr, setScNr, chosen, setChosen, handleAddScenario, setIsSaved, isSaved} = scProps;
    const user = useContext(UserContext);
    const uid = user.uid;


    //Handles choices from dropdown fValues
    const handleChosen = (value, name)=>{
        const chosenList = [...chosen];
        chosenList[0]["data"]["fValues"][name]= value;
        setChosen(chosenList);
        setIsSaved(false);
    }

    //Handles entries from input fields
    const handleEntry = (e)=>{
        e.preventDefault();
        const {name, value} = e.target;
        const chosenList = [...chosen];
        chosenList[0]["data"][name]= value;
        setChosen(chosenList);
        setIsSaved(false);
    }

//Gets features for the other scenario in a pair
const getAltFValues = (fValueList) =>{
    const groupFeat = dceDetails.details.groupFeature;
    const groupFeatValue = fValueList[groupFeat];
    let newFeatValue;
    dceFeatures.forEach((feature) =>{
        if (feature.featureName===groupFeat){
            if(feature.featureValue1===groupFeatValue){
                newFeatValue = feature.featureValue2;}
            if(feature.featureValue2===groupFeatValue){
                newFeatValue = feature.featureValue1;}
        }
    })
    let altFValueList = {...fValueList};
    altFValueList[groupFeat] = newFeatValue;
    return {altFValueList, newFeatValue }
}


//Saves via handleSave and creates the alternative scenario in case of grouped features
const handleCreateAlt = (e)=>{
    if(fieldsComplete()){
    let seqNr;
    handleAddScenario(scNr)
    .then((nr)=>{seqNr=nr;
        //here handleSave
        const chosenList = [...chosen];
        const fValueList = chosen[0]["data"]["fValues"];
        const {altFValueList} = getAltFValues(fValueList);
        chosenList[0]["data"]["altnr"]= seqNr;
        setChosen(chosenList);
        // setNewScNr(seqNr);
        setScNr(seqNr);
        handleSave(e)
        .then(()=>{
        //load data in forms
        setChosen([{}]);
        pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').doc(seqNr.toString()).get()
    .then((doc)=>{
        let data = doc.data();
        let newChosenList = [data]
        newChosenList[0]["data"]["fValues"]=altFValueList;
        setChosen(newChosenList);
        let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
        response.doc(seqNr.toString()).set(newChosenList[0]);
     })
    })
    }).catch((err)=>{
        console.log('Error with saving scenario'+err);
    })
}
}

//Checks if all required field have an entry
const fieldsComplete = ()=>{
    let textOrImageComplete = false;
    let featuresComplete = false;
    if (chosen[0]["data"]["scText"].length!==0 || chosen[0]["data"]["scImg"].length!==0){
        textOrImageComplete=true}
    else{
    alert("Fill in the Scenario Text or upload a Scenario Image, or do both") 
    }
    featuresComplete= !dceFeatures.some(feature=>{
        if(chosen[0]["data"]["fValues"][feature.featureName].length===0){
            alert("Select a value for every feature in the scenario");
             
        } return (chosen[0]["data"]["fValues"][feature.featureName].length===0);
    })
return textOrImageComplete&&featuresComplete;    
}

 //Checks if all required field have an entry and saves to Firestore if ok.
 //Else alert with error message
const handleSave = async (e)=>{
e.preventDefault();

if(fieldsComplete()){
let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
response.doc(scNr.toString()).set(chosen[0]);
const fValues = chosen[0]["data"]["fValues"];
const altnr = chosen[0]["data"]["altnr"];
const {altFValueList} = getAltFValues(fValues);
if (altnr){
    let response = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios');
        response.doc(altnr.toString()).update({
            "data.fValues": altFValueList
        });
}
setIsSaved(true);
}
}

//gets html for this page
// const dceOutProps = {dceId, dceFeatures, dceDetails};
// const scOutProps = {scNr, setScNr, chosen, setChosen, handleAddScenario, setIsSaved, isSaved};
const handleProps = {handleChosen, handleSave, handleEntry, handleCreateAlt};
const {scenarioHtml} = useNewScenarioHtml(  handleProps, dceProps, scProps, dceDetails, chosen );

//Html to show in browser
    return (
        <div key="1">
         {scenarioHtml}
        </div>
    )
}
