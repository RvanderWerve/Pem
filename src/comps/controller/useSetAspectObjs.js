import { useState, useEffect} from 'react';
import { pemFirestore } from "../../firebase/config";

export default function useSetAspectObjs(userId, dceId, currentDce) {
    // Loads aspects from database and return them as objects with combi's including filters for 'in favor' and 'against'
    const [aspectObjs, setAspectObjs] = useState([]);
    const dceFeatures = currentDce.features;

    useEffect(() => {//create functional filters after loading aspects from database. Loading from database is still unchanged from old setup before object oriented design.
        if(userId&&dceId&&currentDce){
        let tempAspectObjs = [];
        setAspectObjs(tempAspectObjs);//ensure AspectObjects are empty
        let response = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
        response.get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{//for each aspect set name and description
                tempAspectObjs.push({aspectName: doc.data().aspectName, aspectDescr: doc.data().aspectDescr, id: doc.id});
                pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(doc.id).collection('Combis')
                .get()
                .then((snapshot)=>{
                    let tempFilters = [];
                    snapshot.forEach((snap)=>{//for each combi set in favor and against filters
                        let tempFilter = snap.data();
                        let favorFilters = [];
                        let againstFilters = [];
                        favorFilters.push(...tempFilter.filterList);
                        againstFilters.push(...tempFilter.filterList);
                        let newFavorFilter = {fName: currentDce.groupFeature, fValue: snap.data().groupValue};//include groupfeature as favorfilter
                        if(snap.data().ageGender){
                            if(snap.data().ageGender.age!==""){//if age string is not empty create agefilter
                        let ageFilter = {fName: "age", fValue: snap.data().ageGender.age};
                        favorFilters.push(ageFilter);
                        againstFilters.push(ageFilter);
                    }
                    if(snap.data().ageGender.gender!==""){//if gender string is not empty create gender filter
                        let genderFilter = {fName: "gender", fValue: snap.data().ageGender.gender};
                        favorFilters.push(genderFilter);
                        againstFilters.push(genderFilter);
                        }}
                        favorFilters.push(newFavorFilter);
                        let newAgainstValue = "";//include opposite value of groupfeature as filter in againstfilters
                        dceFeatures.forEach((feature,i) =>{
                        if (feature.featureName===currentDce.groupFeature){
                            if(feature.featureValue1===snap.data().groupValue){
                                newAgainstValue = feature.featureValue2;}
                            if(feature.featureValue2===snap.data().groupValue){
                                newAgainstValue = feature.featureValue1;}
                        }
                        })
                        let newAgainstFilter = {fName: currentDce.groupFeature, fValue: newAgainstValue};
                        againstFilters.push(newAgainstFilter);
                        tempFilter['favorFilters'] = favorFilters;
                        tempFilter['againstFilters'] = againstFilters
                        tempFilters.push(tempFilter);;
                    })
                    let newTempObjs = [...tempAspectObjs]
                        let index = tempAspectObjs.findIndex(obj=>obj.id===doc.id);//find current aspect in list of aspectObjects
                        newTempObjs[index]['combis'] = tempFilters;//set filters to current aspectObject
                        setAspectObjs(newTempObjs);
                        })
            })
         }).catch((err)=>{
            console.log('Error with loading document'+err);
        })
        return
    }},[userId, dceId, currentDce])

    return {aspectObjs};
}
