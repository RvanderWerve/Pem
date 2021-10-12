import { useState, useEffect } from 'react'
import { pemFirestore } from "../../firebase/config";


const useShowDceList = (uid, dceListChanged) => {//loads the list of dce's from dB and returns them
    const [dceHtml, setDceHtml] = useState([]);
    const [dceNameList, setDceNameList] = useState([]);

        useEffect(()=>{
        pemFirestore.collection('users').doc(uid).collection('DceList').get()
            .then((data)=>{
            let tempDocs = [];
            let tempNameList = [];
            data.docs.forEach(doc => {
                tempDocs.push({...doc.data(), id: doc.id});
                tempNameList.push(doc.data().name.dceName);
              });
            setDceHtml(tempDocs) ;
            setDceNameList(tempNameList);
        })
    },[uid, dceListChanged])


    return {dceHtml, dceNameList}
}
 
export default useShowDceList;