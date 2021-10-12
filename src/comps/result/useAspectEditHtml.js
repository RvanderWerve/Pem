import React, { useState, useEffect } from "react";
import Select from "react-select";


export default function useAspectEditHtml(aspectId, chosenFeatures, groupValues, aspectFilters, handleDeleteCombi, dceFeatures, handleDelete, handleGroupValue, groupFeature, handleFName, handleFValue, handleSave, handleAgeGenderValue, ageGenderValues, filterSaved) {
//create html for aspect edit screen

    const [fromDb, setFromDb] = useState([]);
    const helperArray = [{}];
    const ageOptions = [{label: "younger than 25 years", value: "young"},{label: "25 years or older", value: "old"}];
    const genderOptions = [{label: "female", value: "female"},{label: "male", value: "male"}]
   
useEffect(() => {
    let tempFromDB =[];
    aspectFilters.forEach((combi, cIndex)=>{
        tempFromDB.push( //add following html for each combi
           <div id={cIndex}> {(cIndex!==0)&&(<h5 className="my-5">
           <button onClick={(e)=>handleDeleteCombi(e,cIndex)} className="btn  btn-outline-success btn-sm mx-2"  > <i className="material-icons mat-icon">delete_forever</i></button>
           combined with: 
           </h5>
           )}
           <h5>Select value for group feature - {groupFeature}</h5>

           <label htmlFor="groupVal">Group value</label>
<div className="selectInputs">
           {dceFeatures&&helperArray.map((c,i)=>{return (<Select key={`${aspectId}-grValue- ${cIndex}`} options={[{label: dceFeatures.find(x=>x.featureName===groupFeature).featureValue1, value: dceFeatures.find(x=>x.featureName===groupFeature).featureValue1},
{label: dceFeatures.find(x=>x.featureName===groupFeature).featureValue2, value: dceFeatures.find(x=>x.featureName===groupFeature).featureValue2}]} placeholder={groupValues[cIndex]|| "Select..."} onChange={(option) => handleGroupValue(option.value, cIndex)} />
)})}   
</div>
          <h5>Saved features and values</h5>

           </div>
        )
        combi.forEach((filter, index)=>{
        tempFromDB.push(
        <div id={index} className="my-3"><div className="savedFeatures my-2 mx-3 px-5 py-1 p-3 border rounded">{filter.fName}</div><span className="savedFeatures mx-3 px-5 py-1 border rounded">{filter.fValue}</span>
            <span>
               <button onClick={(e)=>handleDelete(e,index, cIndex)} className="btn  btn-outline-success btn-sm mx-2"  > <i className="material-icons mat-icon">delete_forever</i></button>
               </span>
          </div>
    ) // end of fromDb pt1
}) // end of combi 

tempFromDB.push( //html for adding filter form
    <div>
          <span>
            <form>
              <label htmlFor='fNames' className="col-md-3 col-form-label">Add filter feature </label>
                  <div className="selectInputs">
                  <Select key={`${aspectId}-fName- ${cIndex}`} options={dceFeatures&&dceFeatures.map((feature,ind) =>{
                          let optionHtml = feature.featureName;
                          let isDisabled = false;
                          if (feature.featureName===groupFeature){
                              isDisabled = true
                          }
                          return (
                              {label: optionHtml, value: optionHtml, isDisabled: isDisabled}
                          )
                      })}
                      id="fNames"
                      onChange={(option) => handleFName(option.value, cIndex)}  />
                    </div>
              </form>
              {dceFeatures&&<form>
            
                    <div className="selectInputs pb-3">
                        {chosenFeatures[cIndex][0]&&chosenFeatures[cIndex].map((c,i)=>{return (<Select key={`${aspectId}-fValue- ${cIndex}`} id="fValues" 
                        options={[{label: dceFeatures.find(x=>x.featureName===chosenFeatures[cIndex][0]["fName"]).featureValue1, value: dceFeatures.find(x=>x.featureName===chosenFeatures[cIndex][0]["fName"]).featureValue1},
                        {label: dceFeatures.find(x=>x.featureName===chosenFeatures[cIndex][0]["fName"]).featureValue2, value: dceFeatures.find(x=>x.featureName===chosenFeatures[cIndex][0]["fName"]).featureValue2}]} 
                        placeholder="Enter filter value" onChange={(option) => handleFValue(option.value, cIndex)} />
                        )})}
                    </div>
                    <div className="selectInputs pb-3">
                        <label htmlFor='ageFilter' className="">Optional filters for age and gender of participants </label>
                        {ageGenderValues[cIndex]&&<Select options={ageOptions} isClearable id="ageFilter" name="age" placeholder={ageGenderValues[cIndex]["age"]|| "Select age filter ..."} onChange={(option, name)=>{let value; if(option==null){value=""}else{value=option.value};handleAgeGenderValue(name.name, value, cIndex)}}/>}
                        {ageGenderValues[cIndex]&&<Select options={genderOptions} isClearable id="genderFilter" name="gender" placeholder={ageGenderValues[cIndex]["gender"]|| "Select gender filter ..."} onChange={(option, name)=>{let value; if(option==null){value=""}else{value=option.value};handleAgeGenderValue(name.name, value, cIndex)}}/>}
                    </div>
            </form>}
        </span>
        <button data-id={cIndex} className="btn btn-sm btn-outline-info mb-3" onClick={handleSave}>save filter feature and group value</button>
        {filterSaved[cIndex]&&<h6>Filter saved</h6>}
    </div>
    ) // end of fromDb pt2
}) // end of aspect

    setFromDb(tempFromDB);
    return
    
}, [chosenFeatures, groupValues, ageGenderValues])
   

    return {fromDb}
    
}
