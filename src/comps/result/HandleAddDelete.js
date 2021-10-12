
import { pemFirestore } from "../../firebase/config";



export const  handleAddCombiS = async(userId, dceId, aspectId)=>{
    //Finds free sequence number for combi
    let response = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspectId).collection('Combis').orderBy('nr', 'asc');
    response.get()
    .then((data)=>{
        let seqNr=0;
        for(let i=0; i<data.docs.length; i++){
            if(data.docs[i].data().nr!==seqNr){//if seqNr is free, use it
                setCombi(seqNr, userId, dceId, aspectId);
                return;
            }
            else  {
                seqNr +=1;//try next nr
                if(i===data.docs.length-1){//if there were no combi's, use seqNr=1
                    setCombi(seqNr, userId, dceId, aspectId);
                }
            }
        }
    })
    .catch((error)=>{
        console.log('Error adding combi', error);
    })
    return aspectId;
}

//Saves combi to database with basic values
const setCombi = (seqNr, userId, dceId, aspectId)=>{ 
    pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId).collection('AspectList').doc(aspectId).collection('Combis').doc(seqNr.toString())
    .set({nr: seqNr, groupValue: "", filters: []})
    .then(()=>{
        // console.log('combi added');
        return(aspectId);
    })
    .catch((error)=>{
        console.log('Error adding combi', error);
    })
}

