import React, {useState} from 'react';
import { useLocation, useHistory} from "react-router-dom";
import useAspectEditHtml from './useAspectEditHtml';

export default function AspectEdit({aspectProps, editFunctions, editProps}) {
//Component for editing an aspect

    const [filterSaved, setFilterSaved] = useState([false])
    const location = useLocation();
    const dceFeatures = location.dceFeatures;
    const groupFeature = location.groupFeature;
    const history = useHistory();
    const {saveFilters, setAgeGenderValues, setGroupValues, setChosenFeatures, handleAddCombi, handleDeleteCombi} = editFunctions
    const {aspectId, aspectNameEdit, aspectDescr, aspectFilters} = aspectProps;
    const {groupValues, chosenFeatures, ageGenderValues } = editProps;

    if(groupFeature===undefined){//if groupfeature is undefined, go to main page
        history.push('/');
    }
   
    //Handles feature name from form
    const handleFName = (fName, cIndex)=>{
        const chosenList = [...chosenFeatures];
        chosenList[cIndex][0]={fName: fName};
        const tempSavedList = [...filterSaved];
        tempSavedList[cIndex]=false;
        setChosenFeatures(chosenList);
        setFilterSaved(tempSavedList);
    }

    //Handles feature value from form
    const handleFValue = (fValue, cIndex) =>{
        const chosenList = [...chosenFeatures];
        chosenList[cIndex][0]['fValue'] = fValue;
        const tempSavedList = [...filterSaved];
        tempSavedList[cIndex]=false;
        setChosenFeatures(chosenList);
        setFilterSaved(tempSavedList);
    }
    
    //Handles value for group feature selected in form
    const handleGroupValue = (value, cIndex)=>{
        let tempGValues = [...groupValues]
        tempGValues[cIndex]=value;
        const tempSavedList = [...filterSaved];
        tempSavedList[cIndex]=false;
        setGroupValues(tempGValues);
        setFilterSaved(tempSavedList);
        }
 
        //handles age and gender values as selected
        const handleAgeGenderValue = (name, value, cIndex) =>{
            let tempAgeGenderValues = [...ageGenderValues];
            tempAgeGenderValues[cIndex][name] = value;
            const tempSavedList = [...filterSaved];
            tempSavedList[cIndex]=false;
            setAgeGenderValues(tempAgeGenderValues);
            setFilterSaved(tempSavedList);
        }

    //Checks if all required fields are filled in and then saves to database.
    const handleSave = (e)=>{
        e.preventDefault();
        const cIndex = e.target.dataset.id;
        let tempList = [...aspectFilters[cIndex],...chosenFeatures[cIndex]];
        let tempChosen = [...chosenFeatures];
        if(tempChosen[cIndex][0]&&tempChosen[cIndex][0]['fName'].length>0&&!tempChosen[cIndex][0]['fValue']){
            alert("Select a value for the filter feature before saving")
        }else{
        tempChosen[cIndex] = [];
        if (groupValues[cIndex].length===0){
            alert("Select a value for the Group feature before saving")
            } else{
            saveFilters(cIndex, tempList, tempChosen, groupValues, ageGenderValues);
            const tempSavedList = [...filterSaved];
            tempSavedList[cIndex]=true;
            setFilterSaved(tempSavedList);
            }
        }
    }
//Deletes a filter
    const handleDelete = (e, index, cIndex)=>{
        e.preventDefault();
        let tempCIndex = cIndex.toString();
        let tempFilters = [...aspectFilters[tempCIndex]];
        let emptyChosen = [];
        aspectFilters.forEach(()=>{emptyChosen.push([])});
        tempFilters.splice(index, 1);
        saveFilters(tempCIndex, tempFilters, emptyChosen, groupValues, ageGenderValues);
    }

    //Loads html for displaying aspects and edit forms
    const handleProps = {handleDelete, handleGroupValue, handleFName, handleFValue, handleSave, handleAgeGenderValue, handleDeleteCombi};
    const valueProps = {aspectId, chosenFeatures, groupValues, groupFeature, aspectFilters,  dceFeatures, ageGenderValues, filterSaved};
    const {fromDb} = useAspectEditHtml(handleProps, valueProps);  

//Button for adding a combination filter button
let addCombiButton = [];
   if(aspectNameEdit!=='(Click on ICON in Aspect list)'){
       addCombiButton.push(
        <button className="btn btn-sm btn-outline-info my-4" onClick={handleAddCombi}>add combination feature</button>
        )
}

//returns html to the browser
    return (
        <div>
            <h4 className="mb-1">Define aspect for <b>{aspectNameEdit}</b></h4>
            <h6 className="text-secondary pb-3">Description: {aspectDescr}</h6>     
              {fromDb}
              {addCombiButton}
        </div>
    )
}
