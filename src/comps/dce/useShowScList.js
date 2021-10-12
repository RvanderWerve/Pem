import { pemFirestore } from "../../firebase/config";
import  { useState, useEffect } from "react";


const useShowScList = (uid, dceId, scListChanged) =>{ //loads list of scenario's from dB and returns them
    const [scList, setScList] = useState([]);

useEffect(() => {
    if(dceId){
        pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').orderBy('data.nr')
        .get()
        .then((data)=>{
        let tempDocs = [];
            data.docs.forEach(doc => {
            tempDocs.push({...doc.data(), id: doc.id});
            });
        setScList(tempDocs) ;
        })
        }
  
}, [dceId, uid, scListChanged])

return {scList}
}
export default useShowScList