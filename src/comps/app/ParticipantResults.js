import React from 'react'
import useSetAspectObjs from '../result/useSetAspectObjs';
import useGetResultHtml from '../result/useGetResultHtml';
import ResultDce from "../result/ResultDce";


export default function ParticipantResults({resultList, dceDetails, dceNameEdit, dceId, dceFeatures, userId}) {
    const {details} = dceDetails;
    const {grouped} = details;
    const {aspectObjs} = useSetAspectObjs(userId, dceId, details, dceFeatures);
    const {resultHtml} = useGetResultHtml(aspectObjs, resultList);

    return (
        <div className="my-5"> 
            <p>Thank you for completing this experiment!</p>
            {/*only show results if the dce is grouped*/}
            {grouped&&<div className="col resultsContainer mx-3"> 
                <div className="mb-5"><h3>Your results: </h3>
                {resultHtml}</div>
                <ResultDce  dceDetails={dceDetails} dceId={dceId} dceFeatures={dceFeatures} userId={userId} />
            </div>}
     </div>
    )
}
