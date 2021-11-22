import Select from "react-select";

const StartForm = ({nrQuestions, setStarted, setQNr, handleAGChoice}) => {
//Page component that is shown to the participant at the start of the dce.
//Age and gender are requested. If left empty, the dce will start anyway.
//Values are stored via HandleAGChoice

     const ageOptions = [{label: "younger than 25 years", value: "younger than 25 years"},{label: "25 years or older", value: "25 years or older"}];
     const genderOptions = [{label: "female", value: "female"},{label: "male", value: "male"}]
    
     return ( 
       <div className="my-5"> 
          <div className="col resultsContainer mx-3">
               <h5>Thank you for particpating in this experiment. You will be asked {nrQuestions} questions about your preference.</h5>
               <h5 className="text-secondary mb-5">Please select your gender and age and then start by clicking the button below. </h5>
               
               <div className="col-md-6   mx-auto"> <label htmlFor="gender" className="col-form-label">Gender</label>
                    <Select className="mb-2" options={genderOptions} id="gender" name="gender" onChange={(option, name)=>handleAGChoice(option.value, name.name)}/>
               </div>
               <div className="col-md-6   mx-auto"> <label htmlFor="age" className="col-form-label">Age</label>
                    <Select className="mb-4" options={ageOptions} id="age" name="age" onChange={(option, name)=>handleAGChoice(option.value,  name.name)}/>
               </div>
               <button className="btn blue darken-2 " onClick={()=>{setStarted(true); setQNr(0)}}>Start</button>
          </div>
     </div>
     );
}
 
export default StartForm;