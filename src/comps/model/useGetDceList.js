import { useState, useEffect } from 'react'
import { pemFirestore } from "./firebase/config";
import Dce from './dce';
import GroupedDce from './groupedDce';
import Scenario from './scenario';
import Aspect from './aspect';
import Combi from './combi';
import AgeGender from './ageGender';


const useGetDceList = (uid) => {
        //React hook that returns a list of Dce objects.

    const [dceList, setDceList] = useState([]);
    

    useEffect(()=>{//React hook that loads the list of Dce objects from db and adds it to the dceList . It is triggered by a change in the uid
        pemFirestore.collection('users').doc(uid).collection('DceList').get()
        .then((data)=>{
            let tempDocs = [];
            data.docs.forEach(doc => {
                let dce;
                if(doc.data().grouped){// if this dce is a 'groupedDce' create appropriate type, else create general dce
                    dce = new GroupedDce(  doc.id, doc.data().name, doc.data().descr, doc.data().nrQuestions, doc.data().features, doc.data().grouped, doc.data().groupFeature );
                } else {
                    dce = new Dce(doc.id, doc.data().name, doc.data().descr, doc.data().nrQuestions, doc.data().features, doc.data().grouped)
                }
                tempDocs.push(dce)//add this to the list
            });
            setDceList(tempDocs) ;//store dce list after all dce's are added
        }).catch((err)=>{
            console.log('Error with loading dce'+err);
        })
    },[uid])


    useEffect(() => { //React hook that loads the list of Scenario objects for each dce from db and adds it to the dce . It is triggered by a change in the dceList
        dceList.forEach(dce=>{
            pemFirestore.collection('users').doc(uid).collection('DceList').doc(dce.id).collection('Scenarios').orderBy('id')
            .get()
            .then((docs)=>{
                let tempDocs = [];
                docs.forEach(doc => {//create a scenario object for each database entry
                    let sc = new Scenario(doc.data().id, doc.data().scText, doc.data().scExpl, doc.data().scImg, doc.data().fValues, doc.data().altSc, doc.data().altnr )
                    tempDocs.push(sc);//add scenario to the temp list.
                });
                dce.scList=tempDocs ;//store the temp list to the dce when complete
            }).catch((err)=>{
                console.log('Error with loading scenario document'+err);
            })
        })
    }, [dceList])


    useEffect(() => { //React hook that loads the list of Aspect objects for each dce from db and adds it to the dce . It is triggered by a change in the dceList
        //For each aspect, all combi's are loaded and objects are created. 
        dceList.forEach(dce=>{
            pemFirestore.collection('users').doc(uid).collection('DceList').doc(dce.id).collection('AspectList')
            .get()
            .then((aspects)=>{
                let tempAspectList = [];
                aspects.forEach(aspect => {//load combi's for each aspect
                    const aspectRef = pemFirestore.collection('users').doc(uid).collection('DceList').doc(dce.id).collection('AspectList').doc(aspect.id);
                    let combiList = [];
                    aspectRef.collection('Combis').get()
                    .then((combis)=>{
                        combis.forEach(combi=>{                              
                        let combiObj = new Combi(combi.data().nr,combi.data().groupValue, combi.data().filterList);
                        combiList.push(combiObj);//add combi to the list of combi's
                        })
                        let ageGender = new AgeGender("",  "");//create empty ageGender variable and fill it with data when data was available in db
                        aspect.data().ageGender&& ( ageGender = new AgeGender(aspect.data().ageGender.age, aspect.data().ageGender.gender));
                        let aspectObj = new Aspect(aspect.id, aspect.data().aspectName, aspect.data().aspectDescr, ageGender, combiList)
                        tempAspectList.push(aspectObj);//add aspect to the list
                    });
                dce.aspectList=tempAspectList ;//store aspects in the list
                })
            }).catch((err)=>{
                console.log('Error with loading aspect document'+err);
            }) 
        })
    }, [dceList]);

    return dceList
}

 

export default useGetDceList;