import React from 'react';
import useAspectEditHtml from './useAspectEditHtml';
import Filter from '../model/filter'

export default function AspectEditPage({currentDce, currentAsp, showAspectsFlag, setCurrentDce, setCurrentAsp, filterSaved, setFilterSaved, editFunctions }) {
//Component for editing an aspect 

    const {saveFilters, handleAddCombi, handleDeleteCombi} = editFunctions

   
    //Handles feature name input from form
    const handleFName = (fName, cIndex, index)=>{
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList[index]["fName"]= fName;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
    }

    //Handles feature value input from form
    const handleFValue = (fValue, cIndex, index) =>{
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList[index]["fValue"]= fValue;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
    }
    
    //Handles value for selected group feature in form
    const handleGroupValue = (value, cIndex)=>{
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].groupValue=value;
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
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

   
//Deletes a filter from the current aspect
    const handleDelete = (e, index, cIndex)=>{
        e.preventDefault();
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList.splice(index, 1);
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
      }

//Adds a new empty filter to the currently loaded aspect
    const handleAddFilter = (e, cIndex)=>{
        e.preventDefault();
        const tempCombiList = [...currentAsp.combiList];
        tempCombiList[cIndex].filterList.push(new Filter("",""));
        setCurrentAsp(currentAsp=>({...currentAsp, combiList: tempCombiList}));
        setFilterSaved(false);
    }

//Loads html for displaying aspects and editing forms
    const {editHtml} = useAspectEditHtml(currentDce, currentAsp, showAspectsFlag, handleFName, handleFValue, handleGroupValue, handleAgeGenderValue, handleDelete, handleAddFilter, handleAddCombi, handleDeleteCombi, saveFilters);  

//Button for adding a combination filter
let addCombiButton = [];
   if(!currentAsp.dummy&&!Object.keys(currentAsp).length===0){//only add if an aspect is loaded as current 
       addCombiButton.push(
        <button className="btn btn-sm btn-outline-info my-4" onClick={handleAddCombi}>add combination feature</button>
        )
}

//returns html to the browser, including name and descr of aspect. Alternative text if name is unavailable
    return (
        <div>
            <h4 className="mb-1">Define aspect for <b>{currentAsp.name||"(Select an aspect..)"}</b></h4>
            <h6 className="text-secondary pb-3">Description: {currentAsp.descr}</h6>     
              {!currentAsp.dummy&&editHtml}
              {filterSaved&&<h6>Filters saved</h6>}
        </div>
    )
}
