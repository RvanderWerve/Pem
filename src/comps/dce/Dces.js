import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Link } from "react-router-dom";
import ResultDce from "../result/ResultDce";
import useShowDceList from "./useShowDceList";
import useGetDceDetails from "./useGetDceDetails";

 export default function Dces() { // Shows list of dce's with icons for running them or see results (for grouped dce's)
      
    const [dceSelectEvent, setDceSelectEvent] = useState(null);
    const user = useContext(UserContext);
    const uid = user.uid;
    const {dceHtml} = useShowDceList(uid); 
    const {dceFeatures, dceId, dceDetails} = useGetDceDetails(dceSelectEvent, uid);



  //html to show in browser
    return (
             <div>
        <div className="row my-4">
            <div className="listContainer col col-12 col-sm-3">
           <div className=" col-auto ">
            <h4><u>DCE list</u></h4>
            <ul>
            {dceHtml && dceHtml.map((dce, i)=>{
                return(
                    <div key={i} className="">
                        <h5 className="mt-3"><li className="listRuler mb-1"  data-id={dce.id}> <b>{dce.name.dceName}</b>
                            <hr className="ruler"/> 
                            <Link to={{pathname:"/app/"+uid+"/"+ dce.id}}>
                            <button className="btn btn-sm btn-outline-info mx-1" ><i className="material-icons mat-icon mt-1">play_circle_outline</i></button>
                            </Link>
                            {dce.grouped&&<button className="btn btn-sm btn-outline-danger mx-1" onClick={e=>{setDceSelectEvent(e)}}><i className="material-icons mat-icon mt-1">poll</i></button>} 
                        </li></h5>
                    </div>
                )
                })
            }
        </ul>
</div>
                    <div className="row my-4">
                        <div className="col-auto  ">
                            <div> 
                            </div>
                        </div>
                    </div>
</div>

<div className="col scenarioContainer">
    <ResultDce  dceDetails={dceDetails} dceId={dceId} dceFeatures={dceFeatures} userId={uid} />
</div>
</div>

</div>
    )
}
