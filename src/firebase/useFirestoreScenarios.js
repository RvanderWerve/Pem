import {  useState, useEffect } from 'react';
import { pemFirestore } from './config';


const useFirestoreScenarios = (user, dceId) => {//Load scenario's from firestore db and return them as array for the App component (running the dce)
  const [scenarios, setScenarios] = useState([]);


  useEffect(() => {//React hook for getting the scenario's from the db when user and dceId are known
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