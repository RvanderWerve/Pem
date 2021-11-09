import Select from "react-select";
import { useEffect, useState } from "react";
import UploadForm from "../controller/UploadForm";


const useScenarioDetailsHtml = (currentDce, dceId, currentSc, setCurrentSc, scProps,  handleChosen, setChosen, handleSave, handleCreateAlt, handleEntry, chosen) => {
   // creates html for formsfields and buttons for the NewScenario component

// const {dceId} = dceProps;
const {scNr,  setIsSaved, isSaved} = scProps;
// const {handleChosen, handleSave, handleCreateAlt} = handleProps;
const [scenarioHtml, setScenarioHtml] = useState([]);

// set url for the image and save to chosenList
const setUrl = (url)=>{
    const tempSc = {...currentSc};
    tempSc["scImg"]=url;
    setCurrentSc(tempSc);
    // const chosenList = [...chosen];
    // chosenList[0]["data"]["scImg"]= url;
    // setChosen(chosenList);
    setIsSaved(false)
}

useEffect(()=>{
    console.log("useScDtl triggered")
if(Object.keys(currentSc).length>0){
    let tempHtml = [];
    tempHtml.push(<>
        {currentSc.id&&<div>
        {currentDce&&currentDce.grouped&&<h5>Paired with scenario nr: {currentSc.altnr}</h5>}
        <div key="form-row" className="form-row" > 
        <h6>Features</h6>
        <div className="row">
            {console.log("inside features, fValues are:.."+JSON.stringify(currentSc.fValues))}
      {currentSc.fValues&&currentDce.features&&currentDce.features.map((feature,i) =>{
      let options =[{label: feature.featureValue1, value: feature.featureValue1},
        {label: feature.featureValue2, value: feature.featureValue2}];
            return (
           <div key={i} className="col-md-4  mb-3"> <label htmlFor={i} className="col-form-label">{feature.featureName}</label>
            <Select options={options} key={currentSc.id+i} placeholder={currentSc.fValues[feature.featureName]||"Select.."} defaultValue={currentSc.fValues[feature.featureName]} isDisabled={currentSc.altSc} 
             onChange={(option)=>handleChosen(option.value, feature.featureName)} id={i}/>
            </div>
            )
        })}
        </div>
        </div>
        <form id="textForm">
        <div>
        <h6>Scenario text</h6>
        <textarea className="form-control form-control-sm mb-3" name="scText" value={currentSc.scText} placeholder="Enter scenario text" id="scText" onChange={e=>handleEntry(e)}></textarea>
         </div>
                               
         <div>
             <h6>Scenario explanation</h6>
             <textarea className="form-control form-control-sm mb-3" type="text" name="scExpl" value={currentSc.scExpl} placeholder="Enter additional explanatory text" id="scExpl" onChange={e=>handleEntry(e)}></textarea>

         </div>
         <h6>Scenario image link</h6>
               <UploadForm dceId={dceId} scNr={scNr} setUrl={setUrl} />
               {currentSc.scImg&&<img src={currentSc.scImg} className='scImage' alt="scenario"/>}
               {currentDce&&currentDce.grouped&&!currentSc.altnr&&<input className="btn  btn-outline-success my-3" type="button" onClick={e=>handleCreateAlt(e)} value="Save & Create pair"></input>}
               {(currentSc.altnr||!currentDce.grouped)&&<input className="btn  btn-outline-success my-3" onClick={(e)=>handleSave(e)} value="Save"></input>}
               </form>
               {isSaved&&<div className={isSaved}>Scenario has been saved</div>}
         </div>
         }
         </>
        )
        setScenarioHtml(tempHtml);
         return   
}    
        },[currentDce, currentSc, isSaved])
        
        return {scenarioHtml}
            
        }
        

 
export default useScenarioDetailsHtml;