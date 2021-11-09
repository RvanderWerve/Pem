import {  useState, useEffect } from 'react';
import { pemFirestore } from './config';


const useFirestoreScenarios = (user, dceId) => {//Connect to firestore dB and get scenario's and return them as array
  const [scenarios, setScenarios] = useState([]);


  useEffect(() => {
    if(user&& dceId){
    const unsub = pemFirestore.collection('users').doc(user).collection('DceList').doc(dceId).collection('Scenarios')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          documents.push({...doc.data()});
        });
        setScenarios(documents);
        console.log("scenarios just set: "+JSON.stringify(documents))
      });
    return () => unsub();
    }
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [user, dceId]);

  return { scenarios };
}

export default useFirestoreScenarios;