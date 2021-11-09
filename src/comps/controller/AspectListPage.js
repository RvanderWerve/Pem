import React, {useContext, useState } from "react";
import { pemFirestore } from "../../firebase/config";
import { UserContext } from "../../providers/UserProvider";
import NewAspect from "./NewAspect";
import List from "../view/List";
import AgeGender from "../model/ageGender";
import Combi from "../model/combi";
import Aspect from "../model/aspect";
import AspectEditPage from "../view/AspectEditPage";


export default function AspectListPage({currentDce, dceId, currentAsp, setCurrentDce, setCurrentAsp}) {
    const user = useContext(UserContext);
    const userId = user.uid;
    const [showAspectsFlag, setShowAspectsFlag] = useState('');
    const [refreshListFlag, setRefreshListFlag] = useState('');
    const [filterSaved, setFilterSaved] = useState(false)
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [aspectFilters, setAspectFilters] = useState([]);
    const [groupValues, setGroupValues] = useState([]);
    const [ageGenderValues, setAgeGenderValues] = useState([{age: "", gender: ""}]);
    const [showNew, setShowNew] = useState(false);
    const [aspectNameEdit, setAspectNameEdit] = useState('(Click on ICON in Aspect list)');
    const [aspectDescr, setAspectDescr] = useState('');
    const [aspectId, setAspectId] = useState('');




//Saves all filters of all aspects of this dce to the database
const saveFilters = ()=>{
    const aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
   console.log("aspectList in SaveFilters: "+JSON.stringify(currentDce.aspectList))
    currentDce.aspectList.length>0&& currentDce.aspectList.forEach(aspect=>{
        aspectRef.doc(aspect.id).update({ageGender: {age: aspect.ageGender.age, gender: aspect.ageGender.gender}});
        let combiRef = aspectRef.doc(aspect.id).collection('Combis');
       aspect.combiList.length>0&&(aspect.combiList.forEach(combi=>{
            const {filterList, ...restOfCombi} = combi;
            let dbFilterList = [];
            filterList.forEach(filter=>{
                let filterObj = {fName: filter.fName, fValue: filter.fValue};
                dbFilterList.push(filterObj);
            })
            restOfCombi.filterList = dbFilterList;
            console.log("restOfCombi is:"+JSON.stringify(restOfCombi))
            combiRef.doc(combi.nr.toString()).set(Object.assign({}, restOfCombi))
            .then(()=>{
                console.log('combi saved with nr '+combi.nr);
            })
            .catch((error)=>{
                console.log('Error saving combi', error);
            })
        }))
    })
    // .then(()=>{
    //     console.log("All filters saved");
    //     setFilterSaved(true);
    // })
}



const handleAddCombi = ()=>{
    let newCombiNr = findFreeCombiNr();
    let newCombi = new Combi(newCombiNr, "", []);
    currentAsp.combiList.push(newCombi);
    setCombi(newCombi);
    setShowAspectsFlag("combi added"+newCombiNr)
}

const findFreeCombiNr = ()=>{
    let seqNr=0;
    currentAsp.combiList.sort((a,b)=>a.nr-b.nr).forEach(combi=>{
        if(combi.nr!==seqNr){//if seqNr is free, use it
            return seqNr;
        }
        else  {
            seqNr +=1;//try next nr
           }
    })
    return seqNr;
}

//Saves combi to database for current aspect
const setCombi = (combi)=>{ 
    console.log("user en dce en aspect ids: "+userId+dceId+currentAsp.Id)
    console.log("combi nr: "+combi.nr)
    pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(currentAsp.id).collection('Combis').doc(combi.nr.toString())
    .set(Object.assign({}, combi))
    .then(()=>{
        console.log('combi added with nr '+combi.nr);
    })
    .catch((error)=>{
        console.log('Error adding combi', error);
    })
}

//Deletes a filter combination from the list and database
const handleDeleteCombi = (e, cIndex)=>{
    currentAsp.combiList.splice(cIndex, 1);
    pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(currentAsp.id).collection('Combis').doc(cIndex.toString())
    .delete().then(() => {
        console.log("Combination successfully deleted!");
        setShowAspectsFlag("combi deleted"+cIndex);
        // loadAspectData(aspectId);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });        
}

//delete a aspect from database and refresh list
const deleteAspect = (aspect) => {
    let aspectId =aspect.id;
    let aspIndex = currentDce.aspectList.findIndex(asp=>asp.id===aspectId);
    let aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspectId);
    aspectRef.collection('Combis').get()
    .then((docs)=>{
        docs.forEach(doc=>{
            aspectRef.collection('Combis').doc(doc.id).delete()//delete all subcollections in database first
            .then(()=>{console.log('Combi with ID '+doc.id+ ' deleted')})
        })
    })
    .then(()=>{
        aspectRef.delete()
    .then(() => {
        currentDce.aspectList.splice(aspIndex, 1); //delete scenario from scList
        console.log("Document with ID"+aspectId+ "  successfully deleted!");
        setRefreshListFlag("set flag "+aspectId);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    if(currentAsp.id===aspectId){ //if aspectdetails of deleted aspect were shown on screen,  clear them
        setCurrentAsp({dummy: currentAsp.id})    
    }
  })
}

const addAspect = (name, descr)=>{
    let aspectColl = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
    aspectColl.add( {aspectName: name, aspectDescr: descr, ageGender: {age:"", gender:""}})
    .then((docRef)=>{
          console.log("Document written with ID: ", docRef.id);
          aspectColl.doc(docRef.id).collection('Combis').doc('0').set({nr: 0, groupValue: "", filterList: []});
          let newCombiList = [new Combi(0, "", [])];
          let ageGender = new AgeGender("",  "");
          let newAspect = new Aspect(docRef.id, name, descr, ageGender, newCombiList);
          currentDce.aspectList.push(newAspect);
          setCurrentAsp(newAspect);
          setRefreshListFlag("new aspect saved id "+docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    showNewAspectForm();
}

//toggle to show or hide form for new aspect
  const showNewAspectForm = ()=>{
      if(showNew){setShowNew(false)}
      else if(!showNew){setShowNew(true)}
  }

  const editFunctions = {saveFilters, setGroupValues, setAgeGenderValues, setChosenFeatures, handleAddCombi, handleDeleteCombi}
  const editProps = {ageGenderValues, groupValues, chosenFeatures}
  const aspectProps = {aspectId, aspectFilters}

  //html to show in browser
    return (
    <div>   
        <div className="row my-4">
            <div className="listContainer col col-12 col-sm-3">
                <List currentDce={currentDce} refreshListFlag={refreshListFlag} setCurrentAsp={setCurrentAsp} deleteAspect={deleteAspect}/>
                <div className="row my-4">
                     <div className="col-auto  ">
                        <h4><u>Create new Aspect</u></h4>
                        <div> <button className="btn btn-sm btn-outline-info" onClick={showNewAspectForm}> new Aspect</button>
                        </div>
                        {showNew&&<NewAspect dceId={dceId} addAspect={addAspect} setRefreshListFlag={setRefreshListFlag} showNewAspectForm={showNewAspectForm} />}
                     </div>
                </div>
            </div>

            <div className="col scenarioContainer">
                <AspectEditPage currentDce={currentDce} currentAsp={currentAsp} showAspectsFlag={showAspectsFlag} setCurrentDce={setCurrentDce} setCurrentAsp={setCurrentAsp} filterSaved={filterSaved} setFilterSaved={setFilterSaved} aspectProps={aspectProps} editFunctions={editFunctions} editProps={editProps} />
            </div>
        </div>
    </div>  
  )
}
