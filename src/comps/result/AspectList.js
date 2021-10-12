import React, { useState } from "react";
import { pemFirestore } from "../../firebase/config";
import NewAspect from "./NewAspect";
import AspectEdit from "./AspectEdit";
import { useParams} from "react-router-dom";
import useGetAspectList from "./useGetAspectList";
import List from "./List";
import {handleAddCombiS} from "./HandleAddDelete";

export default function AspectList() {
    const [showAspectsFlag, setShowAspectsFlag] = useState('');
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [aspectFilters, setAspectFilters] = useState([]);
    const [groupValues, setGroupValues] = useState([]);
    const [ageGenderValues, setAgeGenderValues] = useState([{age: "", gender: ""}]);
    const [showNew, setShowNew] = useState(false);
    const [aspectNameEdit, setAspectNameEdit] = useState('(Click on ICON in Aspect list)');
    const [aspectDescr, setAspectDescr] = useState('');
    const [aspectId, setAspectId] = useState('');
    const {userId, dceId } = useParams();
    const {aspects} = useGetAspectList(userId, dceId, showAspectsFlag);

// collect aspect id from clicked button and get data from database so aspect can be edited.
const editAspect = (e) => {
    let aspect;
    if(e.target.parentElement.parentElement.getAttribute('data-id')){
    aspect = e.target.parentElement.parentElement.getAttribute('data-id');
    } else{
        aspect = e.target.parentElement.getAttribute('data-id');
    }
    loadAspectData(aspect);
}

//Loads aspectdata from the database into states
const loadAspectData = (aspect)=>{
    let emptyChosen = [];
    const aspectData = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspect);
    aspectData.get()
    .then((doc)=>{
        const aspectName = doc.data().aspectName;
        let combis = [];
        let tempGValues = [];
        let tempAgeGenderValues = [];
         aspectData.collection('Combis').get()
        .then((snapshot)=>{
            snapshot.docs.forEach(snap=>{
             combis.push(snap.data().filters);
             emptyChosen.push([]);
             tempGValues.push(snap.data().groupValue);
             if(snap.data().ageGender){
             tempAgeGenderValues.push(snap.data().ageGender);}
             if(!snap.data().ageGender){
                 tempAgeGenderValues.push({age: "", gender: ""})
             }
            })
            setGroupValues(tempGValues);
            setAgeGenderValues(tempAgeGenderValues);
            setAspectDescr(doc.data().aspectDescr);
            setAspectFilters(combis);
            setChosenFeatures(emptyChosen);
        })
        .catch((error)=>{
            console.log('Error loading aspect data', error);
        });    
        setAspectNameEdit(aspectName);
        setAspectId(aspect);
    })
    .catch((error)=>{
        console.log('Error loading aspect data', error);
    });    
}

//Saves the filters to the aspect in scope
const saveFilters = (cIndex, filters, emptyChosen, groupValues, ageGenderValues)=>{
    const aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspectId).collection('Combis').doc(cIndex);
    aspectRef.update({filters: filters, groupValue: groupValues[cIndex], ageGender: ageGenderValues[cIndex]})
    .then(() => {
        let tempFilters = [...aspectFilters];
        tempFilters[cIndex] = filters;
        setAspectFilters(tempFilters);//reload filters
        setChosenFeatures(emptyChosen);//reset chosen values
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

//Adds a filter combination
const handleAddCombi = async()=>{
    handleAddCombiS(userId, dceId, aspectId)//find first unused sequence number and save combi to it
    .then((aspectId)=>{
        loadAspectData(aspectId);//reload aspect data from database
    }).catch((err)=>{
        console.log('Error with adding document'+err);
    })
}

//Deletes a filter combination
const handleDeleteCombi = (e, cIndex)=>{
    pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspectId).collection('Combis').doc(cIndex.toString())
    .delete().then(() => {
        console.log("Combination successfully deleted!");
        loadAspectData(aspectId);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });        
}

//delete a aspect from database and refresh list
const deleteAspect = async(e) => {
    let aspect;
    if(e.target.parentElement.parentElement.getAttribute('data-id')){
      aspect = e.target.parentElement.parentElement.getAttribute('data-id');
    } else{aspect = e.target.parentElement.getAttribute('data-id')}    
    let aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspect);
    aspectRef.collection('Combis').get()
    .then((docs)=>{
        docs.forEach(doc=>{
            aspectRef.collection('Combis').doc(doc.id).delete()
            .then(()=>{console.log('Combi with ID '+doc.id+ ' deleted')})
        })
    })
    .then(()=>{
        aspectRef.delete()
    .then(() => {
        console.log("Document with ID"+aspect+ "  successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    if(aspect===aspectId){ //if aspectdetails of deleted aspect were shown on screen,  clear them
        setAspectId('');
        setAspectDescr('');
        setAspectNameEdit('(Click on ICON in Aspect list)');
        setAspectFilters([]);
        setChosenFeatures([]);    
    }
    setShowAspectsFlag("set flag "+aspect);
    })
}

//toggle to show or hide form for new aspect
  const showNewAspectForm = ()=>{
      if(showNew){setShowNew(false)}
      else if(!showNew){setShowNew(true)}
  }

  const editFunctions = {saveFilters, setGroupValues, setAgeGenderValues, setChosenFeatures, handleAddCombi, handleDeleteCombi}
  const editProps = {ageGenderValues, groupValues, chosenFeatures}
  const aspectProps = {aspectId, aspectNameEdit, aspectDescr, aspectFilters}

  //html to show in browser
    return (
    <div>
        <div className="row my-4">
            <div className="listContainer col col-12 col-sm-3">
                <List aspects={aspects} editAspect={editAspect} deleteAspect={deleteAspect}/>
                <div className="row my-4">
                     <div className="col-auto  ">
                        <h4><u>Create new Aspect</u></h4>
                        <div> <button className="btn btn-sm btn-outline-info" onClick={showNewAspectForm}> new Aspect</button>
                        </div>
                        {showNew&&<NewAspect dceId={dceId} setShowAspectsFlag={setShowAspectsFlag} showNewAspectForm={showNewAspectForm} />}
                     </div>
                </div>
            </div>

            <div className="col scenarioContainer">
                <AspectEdit aspectProps={aspectProps} editFunctions={editFunctions} editProps={editProps} />
            </div>
        </div>
    </div>  
  )
}
