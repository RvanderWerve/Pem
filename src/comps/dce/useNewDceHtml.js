import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const useNewDceHtml =( inputProps, groupProps, miscProps )=> {
   // creates html for formsfields and buttons for the NewDce component
const {handleNameInputChange, handleDescrInputChange, handleInputChange, handleRemoveClick, handleNrQuestionsInput, inputList} = inputProps;
const {setGroupValue, groupChecked, groupValue, handleCheckbox} = groupProps;
const {handleAddClick,  saveDce,  nrQuestions} = miscProps;
const [dceHtml, setDceHtml] = useState([]);

 
useEffect(()=>{
let tempHtml = [];

  const options = inputList&&inputList.map((x, i)=>{
    return {label: x.featureName, value: x.featureName}
  })

tempHtml.push(
        <div>
            <form className="form-inline">
                <div >
                <label htmlFor="dceName" className="block">Name: </label>
                    <input type="text" className="form-control mb-2" name="dceName"  placeholder="DCE name" id="dceName" 
                    required onChange={(e)=>handleNameInputChange(e)}></input>
                    </div>
                <div className="">
                <label htmlFor="descr" className="block">Description: </label>
                    <textarea type="text" className="form-control mb-2" name="descr" rows="3"  placeholder="This text will be displayed in the DCE" id="descr" 
                    required onChange={(e)=>handleDescrInputChange(e)}></textarea>
                    </div>
                  
                {inputList&&inputList.map((x, i) => {
        return (
          <div className=" row">
              <div className="">
              <label htmlFor={i} className="">Feature name: </label>
            <input
            className="form-control mb-2"
              name="featureName"
              required
              id={i}
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
              <label htmlFor={i} className="">Feature value 1: </label>
            <input
            className="form-control mb-2"
              name="featureValue1"
              required
              id={i}
              placeholder="Enter value"
              value={x.featureValue1}
              onChange={e => handleInputChange(e, i)}
            />             
            </div>
              <div >
              <label htmlFor={i} className="">Feature value 2: </label>
            <input
            className="form-control mb-2"
              name="featureValue2"
              required
              id={i}
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
        <input type="number" className="col col-xs-1 form-control mb-2" id="nrChoices" required onChange={(e)=>handleNrQuestionsInput(e)} />
      </div>
      <div>
        <input type="checkbox" name="group" id="chkGrp" onClick={(e)=>handleCheckbox(e)}></input>
        <label htmlFor="group" className="">Group by feature </label>
      </div>
      
      <div>
        {groupChecked&&
        <><label className="col-xs-6 col-form-label pb-0" id="gr-label" htmlFor="GrFeat">
            Group feature
          </label>
          <Select className="form form-select-sm col-xs-6 mb-2" id="GrFeat" value={options.label} options={options} onChange={(option) => setGroupValue(option.value)} /></>
          
             }
      {/* {console.log('options are: '+JSON.stringify(options))}       */}
      </div>
      <button className="btn btn-sm btn-outline-success" onClick={(e)=>saveDce(e)} >Save DCE</button>
          </form>

        </div>
)
// console.log('tempHtml van newDce: '+JSON.stringify(tempHtml))
setDceHtml(tempHtml);
 return       
},[inputList, groupValue, nrQuestions, groupChecked])

return {dceHtml}
    
}
export default useNewDceHtml;