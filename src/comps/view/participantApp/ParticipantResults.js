import React from 'react'
import useSetAspectObjs from '../../controller/useSetAspectObjs';
import useGetResultHtml from '../useGetResultHtml';
import ResultDce from "../ResultDce";


export default function ParticipantResults({resultList, currentDce, dceId, userId}) {//Displays resultpage for particpant after completing dce
    const {aspectObjs} = useSetAspectObjs(userId, dceId, currentDce);
    const {resultHtml} = useGetResultHtml(aspectObjs, resultList);//calculates personal result

    return (// Shows personal result on the left and overall result on the right (on large screen, otherwise below eachother)
        <div className="my-5"> 
            <p>Thank you for completing this experiment!</p>
            {/*only show results if the dce is grouped*/}
            {currentDce.grouped&&<div className="col resultsContainer mx-3"> 
                <div className="mb-5"><h3>Your results: </h3>
                {resultHtml}</div>
            </div>}
            {currentDce.grouped&&<div className="col resultsContainer mx-3"> 
                <ResultDce  currentDce={currentDce} dceId={dceId} userId={userId} />
            </div>}

     </div>
    )
}
