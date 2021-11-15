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
    //Main component for displaying the list of aspects. It includes functionality for adding, deleting, modifying and saving.
    const user = useContext(UserContext);
    const userId = user.uid;
    const [showAspectsFlag, setShowAspectsFlag] = useState('');
    const [refreshListFlag, setRefreshListFlag] = useState('');
    const [filterSaved, setFilterSaved] = useState(false)
    const [showNew, setShowNew] = useState(false);


//Saves all filters of all aspects of this dce to the database
const saveFilters = ()=>{
    const aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
   console.log("aspectList in SaveFilters: "+JSON.stringify(currentDce.aspectList))
    currentDce.aspectList.length>0&& currentDce.aspectList.forEach(aspect=>{//for each aspect save the various parts
        aspectRef.doc(aspect.id).update({ageGender: {age: aspect.ageGender.age, gender: aspect.ageGender.gender}});
        let combiRef = aspectRef.doc(aspect.id).collection('Combis');
       aspect.combiList.length>0&&(aspect.combiList.forEach(combi=>{//for each combi save all filters
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
                setFilterSaved(true);//indicator for showing that aspects have been stored to database
            })
            .catch((error)=>{
                console.log('Error saving combi', error);
            })
        }))
    })
}



const handleAddCombi = ()=>{//adds new combi to the combilist and saves to db
    let newCombiNr = findFreeCombiNr();//finds first available nr as combi id, so deleted nrs can be re-used
    let newCombi = new Combi(newCombiNr, "", []);
    currentAsp.combiList.push(newCombi);//adds the new empty combi to the combilist
    setCombi(newCombi);//store to db
    setShowAspectsFlag("combi added"+newCombiNr);//set flag to refresh combilist 
}

const findFreeCombiNr = ()=>{//finds first available nr as combi id from the combilist, so deleted nrs can be re-used
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
    pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(currentAsp.id).collection('Combis').doc(cIndex.toString())
    .delete().then(() => {
        console.log("Combination successfully deleted!");
        currentAsp.combiList.splice(cIndex, 1);//only delete from list after successful deleting from db
        setShowAspectsFlag("combi deleted"+cIndex);//set flag to refresh combilist - required new content to be seen as change.
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });        
}

//delete a aspect from database and list
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
        currentDce.aspectList.splice(aspIndex, 1); //delete scenario from scList after db delete is successful
        console.log("Document with ID"+aspectId+ "  successfully deleted!");
        setRefreshListFlag("set flag "+aspectId);//set flag to refresh aspect list
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    if(currentAsp.id===aspectId){ //if aspectdetails of deleted aspect were shown on screen,  replace with dummy
        setCurrentAsp({dummy: currentAsp.id})    
    }
  })
}

const addAspect = (name, descr)=>{//adds aspect to the aspect list and database
    let aspectColl = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
    aspectColl.add( {aspectName: name, aspectDescr: descr, ageGender: {age:"", gender:""}})
    .then((docRef)=>{
          console.log("Document written with ID: ", docRef.id);
          aspectColl.doc(docRef.id).collection('Combis').doc('0').set({nr: 0, groupValue: "", filterList: []});
          let newCombiList = [new Combi(0, "", [])];//new combi object with id:0 as it will be the first combi in the new aspect
          let ageGender = new AgeGender("",  "");
          let newAspect = new Aspect(docRef.id, name, descr, ageGender, newCombiList);//create new aspect object with new combi and ageGender objects
          currentDce.aspectList.push(newAspect);
          setCurrentAsp(newAspect);
          setRefreshListFlag("new aspect saved id "+docRef.id);//set new content to flag to refresh aspect list
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

  const editFunctions = {saveFilters, handleAddCombi, handleDeleteCombi};//combine some functions needed for edit page

  //html to show in browser. <List> returns list of aspect. <NewAspect> is component with form for creating new aspect
  // <AspectEditPage> provides component for editing the aspect and displaying its details
    return (
    <div>   
        <div className="row my-4">
            <div className="listContainer col col-12 col-sm-3">
                <List currentDce={currentDce} refreshListFlag={refreshListFlag} setCurrentAsp={setCurrentAsp} deleteAspect={deleteAspect} />
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
                <AspectEditPage currentDce={currentDce} currentAsp={currentAsp} showAspectsFlag={showAspectsFlag} setCurrentDce={setCurrentDce} setCurrentAsp={setCurrentAsp} filterSaved={filterSaved} setFilterSaved={setFilterSaved} editFunctions={editFunctions}  />
            </div>
        </div>
    </div>  
  )
}
