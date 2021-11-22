import React, { useState, useEffect} from 'react';

export default function useGetResultHtml(aspectObjs, results) {
    // Calculate outcome of aspectfilters and return html
 
    const [resultHtml, setResultHtml] = useState([]);

    useEffect(() => {//React hook for creating html to display graphic results of selected dce
        let tempResult = [];
        tempResult.push(
            <div key="head">
                <div key="headtext" className="mb-3"> &Delta; P shows the difference in probability that the aspect is true and the 
                probability that the aspect is not true
                </div>
            </div>
        )
        aspectObjs.forEach((aspectObj,i)=>{//For each aspect filter calculate how many results are in favor and against
            let aspectDescr = aspectObj.aspectDescr;
            let oddsFavor = [];
            let oddsAgainst = [];
            if(aspectObj.combis){
            aspectObj.combis.forEach(combi=>{
                    const checkFValue = (result=>{//check if result has to be counted in favor
                        let passesAllFilters = true;
                        combi.favorFilters.forEach(favFilter=>{
                            if(!(favFilter.fValue===result[favFilter.fName]&&result.hasOwnProperty(favFilter.fName))){
                                passesAllFilters = false;
                            }
                        })
                        return(passesAllFilters)
                    })
                    let tempFavors = results.filter(checkFValue);
                    tempFavors.forEach(favor=>{
                        if(oddsFavor.indexOf(favor)===-1){//add to list if not already in list
                            oddsFavor.push(favor);
                        }
                    })
                               
                    const checkAValue = (result=>{//check if result has to be counted against
                        let passesAllFilters = true;
                        combi.againstFilters.forEach(againstFilter=>{
                            if(!(againstFilter.fValue===result[againstFilter.fName]&&result.hasOwnProperty(againstFilter.fName))){
                                passesAllFilters=false;
                            }
                        })
                        return(passesAllFilters)
                    })
                    let tempAgainst = results.filter(checkAValue);
                    tempAgainst.forEach(against=>{
                        if (oddsAgainst.indexOf(against)===-1){//add to list if not already in list
                            oddsAgainst.push(against);
                        }
                    })
                })
            }
            let prob = 0;
            if (oddsAgainst.length>0||oddsFavor.length>0){
                prob = 2*(oddsFavor.length/(oddsFavor.length+oddsAgainst.length))-1;
            }
            let graphProb = Math.abs(prob*50);// property to set width of bar in graph
            let clNames = graphReverse(prob); // Set className to get reverse direction in case of negative number
            let barClasses = getBarClasses(prob); // Set color of bars depending on positive or negative numbers

            tempResult.push(//html for bars and text. Bars 'start' from middle by filling first half with empty bar. Small stripe in case of zero value.
                <div key={`graphs ${i}`} className="pb-2">
                    <span key={`asp-desc ${i}`} className="text-secondary">{aspectDescr}</span><br/>
                    <div key={`clNames ${i}`} className={clNames}>
                        <div key={`pg-bar-pt1 ${i}`} className="progress-bar bg-light-grey" role="progressbar" style={{width: 50+"%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        {prob===0&&<div key={`pg-bar-pt2 ${i}`} className="progress-bar bg-teal" role="progressbar" style={{width: 2 +"px"}} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>}
                        <div key={`pg-bar-pt3 ${i}`} className={barClasses} role="progressbar" aria-valuenow={prob} aria-valuemin="0" aria-valuemax="100" style={{width:graphProb+"%"}}>
                        {(prob>=0.4||prob<=-0.4)&&<span key={`pg-title ${i}`} className="sr-only">&Delta; P = {prob.toFixed(2)}</span>}
                        </div>
                    </div>
                    {(prob<0.4&&prob>-0.4)&&<div key={`pg-desc ${i}`}>&Delta; P = {prob.toFixed(2)}</div>}
                    <span key={`pg-desc2 ${i}`}>(Chosen {(100*prob).toFixed(0)}% {prob<0 ? "less": "more"} than the opposite.)</span>

                </div>
            )
            setResultHtml(tempResult);
        })
        if(aspectObjs.length===0){
            setResultHtml([<div><h5>No aspects defined.</h5></div>])
        }
        return 
    }, [aspectObjs, results])//rerender when aspect objects or results change


    const graphReverse = (prob)=>{// Set className to get reverse direction in case of negative number
        let tempClNames = "progress w-80 mx-auto"
        if (prob<0){
            tempClNames="progress w-80 mx-auto flex-row-reverse"
        }
        return  (tempClNames);
    }

    const getBarClasses = (prob)=>{// Set color of bars depending on positive or negative numbers
        let barClasses = "progress-bar bg-teal progress-bar-striped";
        if (prob<0){
            barClasses = "progress-bar bg-purple progress-bar-striped"
        }
        return barClasses;
    }


    return {resultHtml};
}
