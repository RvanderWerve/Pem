import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const useNewDceHtml =( inputProps, groupProps, miscProps, newDce )=> {
   // creates html for formsfields and buttons for the NewDce component
const {handleEntry, handleInputChange, handleRemoveClick, handleNrQuestionsInput, inputList} = inputProps;
const {setGroupValue, groupChecked, groupValue, handleCheckbox} = groupProps;
const {handleAddClick,  saveDce,  nrQuestions} = miscProps;
const [dceHtml, setDceHtml] = useState([]);

 
useEffect(()=>{//React hook for creating html for new dce
let tempHtml = [];
  const options = inputList&&inputList.map((x, i)=>{
    return {label: x.featureName, value: x.featureName}
  })
tempHtml.push(
        <div key="i">
            <form className="form-inline" key="form">
                <div key="formdiv">
                <label htmlFor="dceName" className="block">Name: </label>
                    <input type="text" className="form-control mb-2" name="name"  placeholder="DCE name" id="dceName" key="dceName"
                     onChange={(e)=>handleEntry(e)}></input>
                    </div>
                <div key="formdiv2">
                <label htmlFor="descr" className="block">Description: </label>
                    <textarea type="text" className="form-control mb-2" name="descr" rows="3"  placeholder="This text will be displayed in the DCE" id="descr" key="descr"
                     onChange={(e)=>handleEntry(e)}></textarea>
                    </div>
                  
                {inputList&&inputList.map((x, i) => {
        return (
          <div className="row" key={"topdiv"+i}>
              <div className="">
              <label htmlFor={i+"Fname"} className="">Feature name: </label>
            <input
            className="form-control mb-2"
              name="featureName"
              required
              id={i +"Fname"}
   placeholder="Enter feature name"
              value={x.featureName}
              onChange={e => handleInputChange(e, i)}
            />             
            </div>
            <div className="col col-xs-1">
            {inputList.length !== 1 && <button
                className="btn btn-sm btn-outline-success mb-2"
                onClick={(e) => handleRemoveClick(e, i)}><i className="material-icons mat-icon">delete_forever</i></button>}
              </div>

              <div >
              <label htmlFor={i+"fV1"} className="">Feature value 1: </label>
            <input
            className="form-control mb-2"
              name="featureValue1"
              required
              id={i+"fV1"}
              key={i+"fV1"}
              placeholder="Enter value"
              value={x.featureValue1}
              onChange={e => handleInputChange(e, i)}
            />             
            </div>
              <div >
              <label htmlFor={i+"fV2"} className="">Feature value 2: </label>
            <input
            className="form-control mb-2"
              name="featureValue2"
              required
              id={i+"fV2"}
              key={i+"fV2"}
              placeholder="Enter value"
              value={x.featureValue2}
              onChange={e => handleInputChange(e, i)}
            />             
            </div>
              <div>
              {inputList.length - 1 === i && <button className="btn btn-sm btn-outline-info mb-2" onClick={(e)=>handleAddClick(e)}>Add another feature</button>}</div>
           </div>
        );
      })}
      <div>
        <label htmlFor="nrChoices">Nr of questions in DCE</label>
        <input type="number" className="col col-xs-1 form-control mb-2" id="nrChoices" name="nrQuestions"  onChange={(e)=>handleNrQuestionsInput(e)} />
      </div>
      <div key="chkbox">
        <input type="checkbox" name="grouped" id="chkGrp" checked={groupChecked} onChange={handleCheckbox}></input>
        <label htmlFor="grouped" className="">Group by feature </label>
      </div>
      
      <div>
        {groupChecked&&
        <><label className="col-xs-6 col-form-label pb-0" id="gr-label" htmlFor="GrFeat">
            Group feature
          </label>
          <Select className="form form-select-sm col-xs-6 mb-2" id="GrFeat" value={options.label} options={options} onChange={(option) => setGroupValue(option.value)} /></>
          
             }
      </div>
      <button className="btn btn-sm btn-outline-success" onClick={(e)=>saveDce(e)} >Save DCE</button>
          </form>

        </div>
)
setDceHtml(tempHtml);
 return       
},[inputList, groupValue, nrQuestions, groupChecked, newDce])

return {dceHtml}
    
}
export default useNewDceHtml;