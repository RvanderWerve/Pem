import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { pemFirestore } from "../../firebase/config";
import useNewDceHtml from "../view/useNewDceHtml";
import Dce from '../model/dce';
import GroupedDce from '../model/groupedDce';

export default function NewDceForm({showNewDceForm, dceList, setDceListChanged, setCurrentDce}) {
  //component for creating a new dce including features and general details

    const [inputList, setInputList] = useState([{ featureName: null, featureValue1: null, featureValue2: null }]);
    const [dceName, setDceName] = useState("");
    const [dceDescr, setDceDescr] = useState([{dceDescr: ""}]);
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
    if(name==="" || dceList.list.length>0 &&dceList.nameList().some(existsName)){
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
                // dce = new GroupedDce(  null, dceName[0], dceDescr[0], nrQuestions, inputList, groupChecked, groupValue);
                } else {
                    dce = new Dce( null, newDce.name, newDce.descr, newDce.nrQuestions, inputList, groupChecked, uid)
                    // dce = new Dce( null, dceName[0], dceDescr[0], nrQuestions, inputList)
                }
            dceList.list.length>0&&dceList.addDce(dce)
            .then(dceId=>{setDceListChanged(dceId);
              console.log("return dceId: "+dceId);
              setCurrentDce(dce);
            });

          // let dceColl = pemFirestore.collection('users').doc(uid).collection('DceList');
          // dceColl.add({name: dceName[0], descr: dceDescr[0], features: inputList, nrFeatures: inputList.length, grouped: groupChecked, groupFeature: groupValue, nrQuestions: nrQuestions})
          // .then((docRef)=>{
          //       console.log("Document written with ID: ", docRef.id);
          //       setDceListChanged(docRef.id);
          // })
          // .catch((error) => {
          //     console.error("Error adding document: ", error);
          // });
          showNewDceForm();
        }
    }

 

    // handle descr input change
    const handleDescrInputChange = (e) => {
      e.preventDefault();
      const {name, value} = e.target;
      const tempDcs = {...newDce};
      console.log("tempDce: "+JSON.stringify(tempDcs))
      tempDcs[name]=value;
      console.log("tempDce: "+JSON.stringify(tempDcs))
      setNewDce(newDce=>({...newDce, [name]: value}));
        }
    
        //Handles entries from input fields
    const handleEntry = (e)=>{
      e.preventDefault();
      const {name, value} = e.target;
      console.log(" tempdce newDce: "+JSON.stringify(newDce))
      // const tempDcs = {...newDce, [name]: value};
      // console.log("tempDce: "+JSON.stringify(tempDcs))
      // tempDcs[name]=value;
      // console.log("tempDce: "+JSON.stringify(tempDcs))
      setNewDce(newDce=>({...newDce, [name]: value}));
      // setDceName(value);
  }

    // handle nr questions input change
    const handleNrQuestionsInput = (e) =>{
      e.preventDefault();
      let nrQuestions = 'nrQuestions'
      const nrString = e.target.value;
      let nrQ = 0;
      nrQ = Number(nrString);
      setNrQuestions(nrQ);
      setNewDce(newDce=>({...newDce, [nrQuestions]: nrQ}));

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

  // checkbox for group feature 
  const handleCheckbox = ()=>{
    // e.preventDefault();
    // const { checked} = e.target;
    setGroupChecked(!groupChecked);
  }

  const inputProps =  {handleEntry, handleDescrInputChange, handleInputChange, handleRemoveClick, handleNrQuestionsInput, inputList};
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
