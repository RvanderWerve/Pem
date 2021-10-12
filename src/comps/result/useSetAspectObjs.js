import { useState, useEffect} from 'react';
import { pemFirestore } from "../../firebase/config";

export default function useSetAspectObjs(userId, dceId, details, dceFeatures) {
    // Loads aspects from database and return them as objects with combi's including filters for 'in favor' and 'against'
    const [aspectObjs, setAspectObjs] = useState([]);


    useEffect(() => {
        if(userId&&dceId&&details&&dceFeatures){
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
                        favorFilters.push(...tempFilter.filters);
                        againstFilters.push(...tempFilter.filters);
                        let newFavorFilter = {fName: details.groupFeature, fValue: snap.data().groupValue};//include groupfeature as favorfilter
                        if(snap.data().ageGender){
                            if(snap.data().ageGender.age!==""){
                        let ageFilter = {fName: "age", fValue: snap.data().ageGender.age};
                        favorFilters.push(ageFilter);
                        againstFilters.push(ageFilter);
                    }
                    if(snap.data().ageGender.gender!==""){
                        let genderFilter = {fName: "gender", fValue: snap.data().ageGender.gender};
                        favorFilters.push(genderFilter);
                        againstFilters.push(genderFilter);
                        }}
                        favorFilters.push(newFavorFilter);
                        let newAgainstValue = "";//include opposite value of groupfeature as filter in againstfilters
                        dceFeatures.forEach((feature,i) =>{
                        if (feature.featureName===details.groupFeature){
                            if(feature.featureValue1===snap.data().groupValue){
                                newAgainstValue = feature.featureValue2;}
                            if(feature.featureValue2===snap.data().groupValue){
                                newAgainstValue = feature.featureValue1;}
                        }
                        })
                        let newAgainstFilter = {fName: details.groupFeature, fValue: newAgainstValue};
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
    }},[userId, dceId, details, dceFeatures])




    return {aspectObjs};
}
