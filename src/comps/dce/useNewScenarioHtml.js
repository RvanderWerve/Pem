import Select from "react-select";
import { useEffect, useState } from "react";
import UploadForm from "./UploadForm";


const useNewScenarioHtml = (dceProps, scProps, handleProps, dceDetails, chosen) => {
   // creates html for formsfields and buttons for the NewScenario component

const {dceId, dceFeatures} = dceProps;
const {scNr, setChosen, setIsSaved, isSaved} = scProps;
const {handleChosen, handleSave, handleEntry, handleCreateAlt} = handleProps;
const [scenarioHtml, setScenarioHtml] = useState([]);

// set url for the image and save to chosenList
const setUrl = (url)=>{
    const chosenList = [...chosen];
    chosenList[0]["data"]["scImg"]= url;
    setChosen(chosenList);
    setIsSaved(false)
}

useEffect(()=>{

    let tempHtml = [];
    tempHtml.push(
        <div>
        {dceDetails.details&&dceDetails.details.grouped&&chosen[0]["data"]&&<h5>Paired with scenario nr: {chosen[0]["data"]["altnr"]}</h5>}
        <div key="form-row" className="form-row" > 
        <h6>Features</h6>
        <div className="row">
  {chosen[0]["data"]&& dceFeatures.map((feature,i) =>{
      let options =[{label: feature.featureValue1, value: feature.featureValue1},
        {label: feature.featureValue2, value: feature.featureValue2}];
            return (
           <div key={i} className="col-md-4  mb-3"> <label htmlFor={i} className="col-form-label">{feature.featureName}</label>
            <Select options={options} key={i} placeholder={chosen[0]["data"]["fValues"][feature.featureName]} defaultValue={chosen[0]["data"]["fValues"][feature.featureName]} isDisabled={chosen[0]["data"]["altSc"]} 
             onChange={(option)=>handleChosen(option.value, feature.featureName)} id={i}/>
            </div>
            )
        })}
        </div>
        </div>
        {chosen[0]["data"]&&<form id="textForm">
        <div>
        <h6>Scenario text</h6>
        <textarea className="form-control form-control-sm mb-3" name="scText" value={chosen[0]["data"]["scText"]} placeholder="Enter scenario text" id="scText" onChange={e=>handleEntry(e)}></textarea>
         </div>
                               
         <div>
             <h6>Scenario explanation</h6>
             <textarea className="form-control form-control-sm mb-3" type="text" name="scExpl" value={chosen[0]["data"]["scExpl"]} placeholder="Enter additional explanatory text" id="scExpl" onChange={e=>handleEntry(e)}></textarea>

         </div>
         <h6>Scenario image link</h6>
               <UploadForm dceId={dceId} scNr={scNr} setUrl={setUrl} />
               {chosen[0]["data"]["scImg"]&&<img src={chosen[0]["data"]["scImg"]} className='scImage' alt="scenario"/>}
               {dceDetails.details&&dceDetails.details.grouped&&!chosen[0]["data"]["altnr"]&&<input className="btn  btn-outline-success mb-3" type="button" onClick={e=>handleCreateAlt(e)} value="Save & Create pair"></input>}
               {(chosen[0]["data"]["altnr"]||!dceDetails.details.grouped)&&<input className="btn  btn-outline-success mb-3" onClick={(e)=>handleSave(e)} value="Save"></input>}
               </form>}
               {isSaved&&<div className={isSaved}>Scenario has been saved</div>}
         </div>
        )
        setScenarioHtml(tempHtml);
         return       
        },[dceDetails, chosen, isSaved])
        
        return {scenarioHtml}
            
        }
        

 
export default useNewScenarioHtml;