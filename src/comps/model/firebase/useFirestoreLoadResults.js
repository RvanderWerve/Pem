import {  useState, useEffect } from 'react';
import { pemFirestore } from './config';


const useFirestoreLoadResult = (user, dceId) => {//Loads the raw results from the database and returns them
  const [results, setResults] = useState([]);


  useEffect(() => {
    if(user&&dceId){
      let unsub = pemFirestore.collection('users').doc(user).collection('DceList').doc(dceId).collection('RawResults')
      .onSnapshot(snap => {
          let documents = [];
          snap.forEach(doc => {//cycles through all result docs from the db and adds them to the results array
            documents.push({...doc.data().pref, id: doc.id});
          });
          setResults(documents);
        });
        return () => unsub();
      // this is a cleanup function that react will run when
      // a component using the hook unmounts
    }}, [user, dceId]);

    return {results} ;
}

export default useFirestoreLoadResult;