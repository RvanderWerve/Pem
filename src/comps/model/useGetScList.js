import { pemFirestore } from "../../firebase/config";
import  { useState, useEffect } from "react";
import Scenario from "./scenario";


const useGetScList = (uid, dceId, scListChanged) =>{ //loads list of scenario's from dB and returns them
    const [scList, setScList] = useState([]);

useEffect(() => {
    if(dceId&&uid){
        pemFirestore.collection('users').doc(uid).collection('DceList').doc(dceId).collection('Scenarios').orderBy('id')
        .get()
        .then((docs)=>{
        let tempDocs = [];
            docs.forEach(doc => {console.log("data.doc: "+JSON.stringify(doc.data()))
                let sc = new Scenario(doc.data().id, doc.data().scText, doc.data().scExpl, doc.data().scImg, doc.data().fValues, doc.data().altSc, doc.data().altnr )
                // let sc = new Scenario(doc.data().data.nr, doc.data().data.scText, doc.data().data.scExpl, doc.data().data.scImg, doc.data().data.fValues, doc.data().data.altSc, doc.data().data.altnr )
            // tempDocs.push({...doc.data(), id: doc.id});
            tempDocs.push(sc);
            });
            console.log("scList: "+JSON.stringify(tempDocs))
        setScList(tempDocs) ;
        })
        }
  
}, [dceId, uid, scListChanged])

return scList
}
export default useGetScList