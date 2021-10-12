import React from 'react';
import useFirestoreLoadResult from '../../firebase/useFirestoreLoadResults';
import useSetAspectObjs from './useSetAspectObjs';
import useGetResultHtml from './useGetResultHtml';


export default function ResultDce({dceId, dceDetails, dceFeatures, userId}) {
    //Shows results of a DCE. Only available for grouped dce's at present

    const {results} = useFirestoreLoadResult(userId ,dceId);//load results from database
    const {details} = dceDetails;
    const {aspectObjs} = useSetAspectObjs(userId, dceId, details, dceFeatures); //load aspects from dB
    const {resultHtml} = useGetResultHtml(aspectObjs, results); //calculate numbers and return html for results

    return (
        <div key="main">
           <div key="title" className="mb-5"><h3>Total results from all particpants: </h3>
            {resultHtml}</div>
           
        </div>
    )
}
