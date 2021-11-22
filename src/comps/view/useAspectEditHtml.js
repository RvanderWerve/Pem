import React, { useState, useEffect } from "react";
import Select from "react-select";


export default function useAspectEditHtml(currentDce, currentAsp, showAspectsFlag, handleFName, handleFValue, handleGroupValue, handleAgeGenderValue, handleDelete, handleAddFilter, handleAddCombi, handleDeleteCombi, saveFilters) {
//create html for aspect edit screen

    const [editHtml, setEditHtml] = useState([]);
    const helperArray = [{}];
    const ageOptions = [{label: "younger than 25 years", value: "younger than 25 years"},{label: "25 years or older", value: "25 years or older"}];
    const genderOptions = [{label: "female", value: "female"},{label: "male", value: "male"}];
    const dceFeatures = currentDce.features;
    
    useEffect(() => {
        let tempEditHtml =[];
        currentAsp.combiList&& currentAsp.combiList.forEach((combi, cIndex)=>{
            tempEditHtml.push( //add following html for each combi
            <div key={cIndex+currentAsp.id} id={cIndex}> {(cIndex!==0)&&(<h5 className="my-5">
                <button onClick={(e)=>handleDeleteCombi(e,cIndex)} className="btn  btn-outline-success btn-sm mx-2"  > <i className="material-icons mat-icon">delete_forever</i></button>
                combined with: 
                </h5>
                )}
                <h5>Select value for group feature - {currentDce.groupFeature}</h5>
                <label htmlFor="groupVal">Group value</label>
                <div className="selectInputs mb-3">
                    {currentDce.features&&helperArray.map((c,i)=>{return (<Select key={`${currentAsp.id}-grValue- ${cIndex}`} options={[{label: currentDce.features.find(x=>x.featureName===currentDce.groupFeature).featureValue1, value: currentDce.features.find(x=>x.featureName===currentDce.groupFeature).featureValue1},
                    {label: currentDce.features.find(x=>x.featureName===currentDce.groupFeature).featureValue2, value: currentDce.features.find(x=>x.featureName===currentDce.groupFeature).featureValue2}]} placeholder={combi.groupValue|| "Select..."} onChange={(option) => handleGroupValue(option.value, cIndex)} />
                    )})}   
                </div>
                <h5>Filter features and values</h5>
            </div>
            )
            combi.filterList&&combi.filterList.length>0&&combi.filterList.forEach((filter, index)=>{
            tempEditHtml.push(
            <div key={`${currentAsp.id}-feature- ${cIndex} ${index}`} id={index} className="selectInputs my-3">
                <span>
                <Select key={`${currentAsp.id}-fName- ${cIndex}`} options={dceFeatures&&dceFeatures.map((feature,ind) =>{
                            let optionHtml = feature.featureName;
                            let isDisabled = false;
                            if (feature.featureName===currentDce.groupFeature){
                                isDisabled = true
                            }
                            return (
                                {label: optionHtml, value: optionHtml, isDisabled: isDisabled}
                            )
                        })}
                        id="fNames"
                        placeholder={filter.fName}
                        onChange={(option) =>{console.log("option.value +cIndex in onChange: "+JSON.stringify(option.value)+cIndex); handleFName(option.value, cIndex, index)}}  
                        />
                        </span>
                        <span className="selectInputs pb-3">
                            {filter.fName&&<Select options={[{label: dceFeatures.find(x=>x.featureName===filter["fName"]).featureValue1, value: dceFeatures.find(x=>x.featureName===filter["fName"]).featureValue1},
                            {label: dceFeatures.find(x=>x.featureName===filter["fName"]).featureValue2, value: dceFeatures.find(x=>x.featureName===filter["fName"]).featureValue2}]} 
                            placeholder={filter.fValue||"Enter filter value"} onChange={(option) => handleFValue(option.value, cIndex, index)}/>}
                        </span>

                <span>
                <button onClick={(e)=>handleDelete(e,index, cIndex)} className="btn  btn-outline-success btn-sm mx-2"  > <i className="material-icons mat-icon">delete_forever</i></button>
                </span>
            </div>
        ) // end of editHtml pt1
    }) // end of filter 

    tempEditHtml.push( //html for adding filter form
        <div key={"addFilterButton"+cIndex}>
            <span>
                <button onClick={(e)=>handleAddFilter(e, cIndex)} className="btn  btn-outline-success btn-sm mx-2"  > Add filter feature</button>
                </span>
            
                </div>
                ) // end of editHtml pt2
    }) // end of combi
    tempEditHtml.push( //html for adding filter form
        <div key={`filterform +${currentAsp.id}`}>
                    {(!currentAsp.dummy&&Object.keys(currentAsp).length>0)&&<button className="btn btn-sm btn-outline-info my-4" onClick={handleAddCombi}>add combination feature</button>}
            <span>
                {dceFeatures&&<form>
                            
                        <div key="agSelectForm" className="selectInputs pb-3">
                        {currentAsp.ageGender&&<label htmlFor='ageFilter' className="">Optional filters for age and gender of participants </label>}
                            {currentAsp.ageGender&&<Select options={ageOptions} key="ageFilter" isClearable id="ageFilter" name="age" placeholder={currentAsp.ageGender.age|| "Select age filter ..."} onChange={(option, name)=>{let value; if(option==null){value=""}else{value=option.value};handleAgeGenderValue(name.name, value, currentAsp.id)}}/>}
                            {currentAsp.ageGender&&<Select options={genderOptions} key="genderFilter" isClearable id="genderFilter" name="gender" placeholder={currentAsp.ageGender.gender|| "Select gender filter ..."} onChange={(option, name)=>{let value; if(option==null){value=""}else{value=option.value};handleAgeGenderValue(name.name, value,currentAsp.id)}}/>}
                        </div>
                </form>}
            </span>

            {(!currentAsp.dummy&&Object.keys(currentAsp).length>0)&&<button  className="btn btn-sm btn-outline-info mb-3" onClick={saveFilters}>save all filters </button>}
        </div>
    ) // end of aspect

        setEditHtml(tempEditHtml);
        return
        
    }, [currentAsp, currentDce, showAspectsFlag])
    

    return {editHtml}
    
}
