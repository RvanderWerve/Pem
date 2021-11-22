import React from 'react';
import useFirestoreLoadResult from '../model/firebase/useFirestoreLoadResults';
import useSetAspectObjs from '../controller/useSetAspectObjs';
import useGetResultHtml from './useGetResultHtml';


export default function ResultDce({currentDce, dceId, userId}) {
    //Shows results of a DCE. Only available for grouped dce's at present

    const {results} = useFirestoreLoadResult(userId ,dceId);//load results from database
    const {aspectObjs} = useSetAspectObjs(userId, dceId, currentDce); //load aspects from dB
    const {resultHtml} = useGetResultHtml(aspectObjs, results); //calculate numbers and return html for results
    const nrParticipants = Math.ceil(results.length/currentDce.nrQuestions)

    return (//return html for the page
        <div key="main">
            {!currentDce.id&&<div><h3>Click on <i className="material-icons mt-1  btn-outline-danger">poll</i> in the dce list for results.</h3> <h5>(only available for grouped dce's)</h5></div> }
           {currentDce.id&&<div key="title" className="mb-5"><h3>Total results from all particpants: </h3>
           <div><h6>Number of particpants: {nrParticipants}</h6></div>
                {resultHtml}
            </div>}
           
        </div>
    )
}
