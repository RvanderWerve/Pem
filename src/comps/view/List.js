import React, { useEffect, useState } from 'react'

export default function List({currentDce, refreshListFlag, setCurrentAsp, deleteAspect}) {
const [listHtml, setListHtml] = useState([]);

    useEffect(()=>{//React hook for generating the html for displaying the list of aspects
        let tempList = [];
        currentDce.aspectList&& currentDce.aspectList.forEach((aspect, i)=>{
tempList.push(<div key={`aspectList ${i}`} className="">
<h6 className="mt-3">
    <li  key={i} className="listRuler mb-1"  data-id={aspect.id}> <b>{aspect.name}</b>
        <hr className="ruler"/> 
        <button className="btn btn-sm btn-outline-warning" onClick={()=>{setCurrentAsp({dummy:"clear"+i});setCurrentAsp(aspect)}}><i className="material-icons mat-icon">edit</i></button>
        <hr className="rulerSm"/>
        <button className="btn  btn-outline-success btn-sm mx-2" onClick={()=>{deleteAspect(aspect)}}><i className="material-icons mat-icon">delete_forever</i></button>
    </li>
</h6>
</div>
)
        })
 setListHtml(tempList);
    },[currentDce, refreshListFlag])//gets re-rendered when flag is changed

    //Component for displaying aspect list
    return (
        <div>
            <div className=" col-auto ">
                <h4><u>Aspect list</u></h4>
                <ul>
                    {listHtml}
                </ul>
            </div>

        </div>
    )
}
