import {useRef, useEffect } from 'react'
import { pemFirestore } from '../firebase/config';

export default function useSaveResult(finished, answerList, userId, dceId, setResultList) {

    const initialRender = useRef(true);

    //Save results to database when experiment is finished
    useEffect(() => {
        if (initialRender.current) {
        initialRender.current = false;   // ensure this effect does not run on startup
        } else {
                let collRef = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('RawResults')
                let tempResultList = [];
                answerList.forEach((answer,i)=> {
                    tempResultList.push(answer.pref,i);
                    collRef.add(answer)   //save each result as separate entry to firstore db for total result
                    .then((docRef)=>{
                        console.log("answer added to results collection with id: "+docRef.id)
                        })
                    .catch((error)=>{console.error("Error adding document: ", error);
                    })
                    });
                console.log("tempResultList: " +JSON.stringify(tempResultList))
                setResultList(tempResultList);  //save this dce result as a list for personal result presentation
            }
        }, [finished])
    

    return 
 }
