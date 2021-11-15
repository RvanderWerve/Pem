import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import useNewDceHtml from "../view/useNewDceHtml";
import Dce from '../model/dce';
import GroupedDce from '../model/groupedDce';

export default function NewDceForm({showNewDceForm, dceList, setDceListChanged }) {
  //component for creating a new dce including features and general details

    const [inputList, setInputList] = useState([{ featureName: null, featureValue1: null, featureValue2: null }]);
    const [groupChecked, setGroupChecked] = useState(false);
    const [groupValue, setGroupValue] = useState(null);
    const [nrQuestions, setNrQuestions] = useState(0);
    const [newDce, setNewDce] = useState({descr: ""})
    const user = useContext(UserContext);
    const uid = user.uid;

    //Check if feature names and values are all filled in before save
  const featuresNotNull = (item)=>{
if(item.featureName==null||item.featureName===""){
alert("Please fill in all feature names");
return false;
}
if(item.featureValue1==null||item.featureValue1===""||item.featureValue2==null||item.featureValue2===""){
  alert("Please fill in all feature values");
  return false;
}
return true;
  }

//helper for dceNotNull check
  const existsName = (name => newDce.name===name);

//Check if dce name and number of questions are all filled in before save. Also check if dce name is unique
  const dceNotNull = ()=>{
    let name=newDce.name;
    console.log("field not null check, dceName: "+name)
    if(name===undefined||name==="" || (dceList.list.length>0 &&dceList.nameList().some(existsName))){
      alert("Fill in a unique DCE name");
      return false;
    }
    if(newDce.nrQuestions<=0||!newDce.nrQuestions){
      alert("Fill in the number of questions (higher than 0) the participant has to answer in the DCE");
      return false;
    }
    return true;
  }

  //Check if groupValue is not null 
  const groupValueNotNull = ()=>{
    if (groupChecked&&groupValue===null){
      alert("Please select a value for the group feature");
      return false;
    }
    return true;
  }

  //Save dce if all fields are filled in
    const saveDce = (e)=>{
        e.preventDefault();
        if(inputList.every(featuresNotNull)&&dceNotNull()&&groupValueNotNull()){
          let dce;
                if(groupChecked){
                dce = new GroupedDce( null, newDce.name, newDce.descr, newDce.nrQuestions, inputList, groupChecked, groupValue, uid);
                } else {
                    dce = new Dce( null, newDce.name, newDce.descr, newDce.nrQuestions, inputList, groupChecked, uid)
                }
            dceList.list&&dceList.addDce(dce)//method that adds the newly created dce to the dceList and database
            .then(dceId=>{setDceListChanged(dceId);//flag to refresh dce list on screen
              console.log("return dceId: "+dceId);
              });

            showNewDceForm();
        }
    }

 
    
        //Handles entries from input fields
    const handleEntry = (e)=>{
      e.preventDefault();
      const {name, value} = e.target;
      setNewDce(newDce=>({...newDce, [name]: value}));
  }

    // handle nr questions input change
    const handleNrQuestionsInput = (e) =>{
      e.preventDefault();
      let nrQuestions = 'nrQuestions'
      const nrString = e.target.value;
      let nrQ = 0;
      nrQ = Number(nrString);//converts input to nr
      setNrQuestions(nrQ);//sets nr questions for this dce
      setNewDce(newDce=>({...newDce, [nrQuestions]: nrQ}));//adds nr questions to the new dce
    }

     // handle feature input change
  const handleInputChange = (e, index) => {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };
 
  // deletes feature in the new dce form
  const handleRemoveClick = (e, index) => {
    e.preventDefault();
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
 
  // Adds another feature in the form
  const handleAddClick = (e) => {
    e.preventDefault();
    setInputList([...inputList, { featureName: null , featureValue1: null, featureValue2: null}]);
  }

  // checkbox for group feature.Inverts value
  const handleCheckbox = ()=>{
   setGroupChecked(!groupChecked);
  }

  //combine some of the properties that are required for getting the html
  const inputProps =  {handleEntry, handleInputChange, handleRemoveClick, handleNrQuestionsInput, inputList};
  const groupProps = {setGroupValue, groupChecked, groupValue, handleCheckbox};
  const miscProps = {handleAddClick,  saveDce,  nrQuestions};

  //gets html for this page
const {dceHtml} = useNewDceHtml(inputProps, groupProps, miscProps, newDce);

  //html to show in browser
  return (
        <div>
          {dceHtml}
        </div>
    )
}
