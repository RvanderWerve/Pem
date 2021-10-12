import { useState, useEffect } from "react";
import { pemFirestore } from "../../firebase/config";


const useGetAspectList = (userId, dceId, showAspectsFlag)=>{//get list of aspects from dB
const [aspects, setAspects] = useState([]);

    useEffect(() => {
        if(userId&&dceId){
        let response = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList');
        response.get()
        .then((data)=>{
            let tempDocs = [];
            data.docs.forEach(doc => {
                tempDocs.push({...doc.data(), id: doc.id});
            });
            setAspects(tempDocs) ;
        }).catch((err)=>{
            console.log('Error with loading document'+err);
        })
    }
    }, [userId, dceId, showAspectsFlag]);
    return {aspects}
}

export default useGetAspectList;