import  {  useEffect, useState } from "react";
import { pemFirestore } from "../../firebase/config";


const useGetDceDetails = (e, uid)=>{// Gets dce details from database after it has been selected

    const [dceNameEdit, setDceNameEdit] = useState('(Click on ICON in DCE list)');
    const [dceFeatures, setDceFeatures] = useState([]);
    const [dceId, setDceId] = useState('');
    const [dceDetails, setDceDetails] = useState([]);

    useEffect(() => {
        if(e){
        let dce;
        //get parent element as well as parent of parent to avoid misclick on icon
            if(e.target.parentElement.parentElement.getAttribute('data-id')){
                dce = e.target.parentElement.parentElement.getAttribute('data-id');
            } else{
                dce = e.target.parentElement.getAttribute('data-id');
            }
            pemFirestore.collection('users').doc(uid).collection('DceList').doc(dce).get()
            .then((doc)=>{
                const dceName = doc.data().name.dceName;
                const tempDetails = {details: {grouped: doc.data().grouped, groupFeature: doc.data().groupFeature, nrQuestions: doc.data().nrQuestions}}
                setDceNameEdit(dceName);
                setDceFeatures(doc.data().features)
                setDceId(dce);
                setDceDetails(tempDetails);
            })
            .catch((error)=>{
                console.error("Error loading document: ", error);
        })
    }
    }, [e, uid])
    return {dceNameEdit, dceFeatures, dceId, dceDetails}
}

export default useGetDceDetails;