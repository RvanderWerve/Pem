import { useState, useEffect } from "react";
import { pemFirestore } from "../../firebase/config";
import Aspect from "./aspect"
import AgeGender from "./ageGender";
import Combi from "./combi";


const useGetAspectListBak = (userId, dceId, showAspectsFlag)=>{
    //React hook that returns a list of Aspect objects.
    //For each aspect, all combi's are loaded and objects are created. 
    //The list will be rerendered when showAspectsFlag is changed.

const [aspects, setAspects] = useState([]);

    useEffect(async() => {
        if(userId&&dceId){
        pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList')
        .get()
        .then((aspects)=>{
            let tempAspectList = [];
            aspects.forEach(aspect => {//load combi's for each aspect
                const aspectRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspect.id);
                    let combiList = [];
                     aspectRef.collection('Combis').get()
                    .then((combis)=>{
                        combis.forEach(combi=>{     
                            let ageGender = null;//create empty ageGender variable and fill it with data when data was available in db
                            combi.data().ageGender&& ( ageGender = new AgeGender(combi.data().ageGender.age,combi.data().ageGender.gender));

                        let combiObj = new Combi(combi.data().nr,combi.data().groupValue, combi.data().filters, ageGender);
                        combiList.push(combiObj);//add combi to the list of combi's
                         })
                
                let aspectObj = new Aspect(aspect.id, aspect.data().aspectName, aspect.data().aspectDescr, combiList); //create new Apect when all data has been collected
                tempAspectList.push(aspectObj);//add aspect to the list
                 });
            setAspects(tempAspectList) ;//store aspects in the list
                })
        }).catch((err)=>{
            console.log('Error with loading document'+err);
        }) 
        }
    }, [userId, dceId, showAspectsFlag]); //rerender when showAspectsFlag is changed
    return aspects
}

export default useGetAspectListBak;