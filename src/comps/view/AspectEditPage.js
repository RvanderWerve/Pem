import React, {useState} from 'react';
import { useLocation} from "react-router-dom";
import useAspectEditHtml from './useAspectEditHtml';
import Filter from '../model/filter'

export default function AspectEditPage({currentDce, currentAsp, showAspectsFlag, setCurrentDce, setCurrentAsp, filterSaved, setFilterSaved, aspectProps, editFunctions, editProps}) {
//Component for editing an aspect

    // const [filterSaved, setFilterSaved] = useState(false)
    const location = useLocation();
    const dceFeatures = location.dceFeatures;
    const groupFeature = location.groupFeature;
    const {saveFilters, setAgeGenderValues, setGroupValues, setChosenFeatures, handleAddCombi, handleDeleteCombi} = editFunctions
    const {aspectId, aspectFilters} = aspectProps;
    const {groupValues, chosenFeatures, ageGenderValues } = editProps;

    // if(groupFeature===undefined){//if groupfeature is undefined, go to main page
    //     history.push('/');
    // }
   
    //Handles feature name from form
    const handleFName = (fName, cIndex, index)=>{
        // const chosenList = [...chosenFeatures];
        // chosenList[cIndex][0]={fName: fName};
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList[index]["fName"]= fName;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        // const tempSavedList = [...filterSaved];
        // tempSavedList[cIndex]=false;
        // setChosenFeatures(chosenList);
        setFilterSaved(false);
    }

    //Handles feature value from form
    const handleFValue = (fValue, cIndex, index) =>{
        // const chosenList = [...chosenFeatures];
        // chosenList[cIndex][0]['fValue'] = fValue;
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList[index]["fValue"]= fValue;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        // const tempSavedList = [...filterSaved];
        // tempSavedList[cIndex]=false;
        // setChosenFeatures(chosenList);
        setFilterSaved(false);
    }
    
    //Handles value for group feature selected in form
    const handleGroupValue = (value, cIndex)=>{
        // let tempGValues = [...groupValues]
        // tempGValues[cIndex]=value;
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].groupValue=value;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        // const tempSavedList = [...filterSaved];
        // tempSavedList[cIndex]=false;
        // setGroupValues(tempGValues);
        setFilterSaved(false);
        }
 
        //handles age and gender values as selected
        const handleAgeGenderValue = (name, value, aspId) =>{
            let aspIndex = currentDce.aspectList.findIndex(asp=>asp.id===aspId);
            const tempAspectList = [...currentDce.aspectList];
            const tempAspect = {...tempAspectList[aspIndex]};
            const tempAgeGender = {...tempAspect.ageGender};
            tempAgeGender[name] = value;
            tempAspect.ageGender=tempAgeGender;
            tempAspectList[aspIndex]=tempAspect;
            setCurrentDce(currentDce=>({...currentDce, aspectList: tempAspectList}));
            setCurrentAsp(currentAsp=>({...currentAsp, ageGender: tempAgeGender}))
            setFilterSaved(false);
        }

    // //Checks if all required fields are filled in and then saves to database.
    // const handleSave = (e)=>{
    //     e.preventDefault();
    //     const cIndex = e.target.dataset.id;
    //     let tempList = [...aspectFilters[cIndex],...chosenFeatures[cIndex]];
    //     let tempChosen = [...chosenFeatures];
    //     if(tempChosen[cIndex][0]&&tempChosen[cIndex][0]['fName'].length>0&&!tempChosen[cIndex][0]['fValue']){
    //         alert("Select a value for the filter feature before saving")
    //     }else{
    //     tempChosen[cIndex] = [];
    //     if (groupValues[cIndex].length===0){
    //         alert("Select a value for the Group feature before saving")
    //         } else{
    //         saveFilters(cIndex, tempList, tempChosen, groupValues, ageGenderValues);
    //         const tempSavedList = [...filterSaved];
    //         tempSavedList[cIndex]=true;
    //         setFilterSaved(tempSavedList);
    //         }
    //     }
    // }
//Deletes a filter
    const handleDelete = (e, index, cIndex)=>{
        e.preventDefault();
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList.splice(index, 1);
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
      }

    const handleAddFilter = (e, cIndex)=>{
        e.preventDefault();
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList.push(new Filter("",""));
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
    }

    //Loads html for displaying aspects and edit forms
    // const handleProps = {  handleSave};
    const valueProps = {   groupFeature,   dceFeatures, filterSaved};
    const {fromDb} = useAspectEditHtml(currentDce, currentAsp, showAspectsFlag, handleFName, handleFValue, handleGroupValue, handleAgeGenderValue, handleDelete, handleAddFilter, handleAddCombi, handleDeleteCombi, saveFilters, valueProps);  

//Button for adding a combination filter button
let addCombiButton = [];
   if(!currentAsp.dummy&&!Object.keys(currentAsp).length===0){
       addCombiButton.push(
        <button className="btn btn-sm btn-outline-info my-4" onClick={handleAddCombi}>add combination feature</button>
        )
}

//returns html to the browser
    return (
        <div>
            <h4 className="mb-1">Define aspect for <b>{currentAsp.name||"(Select an aspect..)"}</b></h4>
            <h6 className="text-secondary pb-3">Description: {currentAsp.descr}</h6>     
              {!currentAsp.dummy&&fromDb}
              {/* {addCombiButton} */}
        </div>
    )
}
