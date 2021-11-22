import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Link } from "react-router-dom";
import ResultDce from "./ResultDce";
import useGetDceList from "../model/useGetDceList";

 export default function DcePlayListPage({dceList}) { // Shows list of dce's with icons for running them or see results (for grouped dce's)
      
    const user = useContext(UserContext);
    const uid = user.uid;
    const [currentDce, setCurrentDce] = useState({});
    dceList.list = useGetDceList(uid);//loads the list of dce's


    //html to show in browser
    return (
        <div>
            <div className="row my-4">
                <div className="listContainer col col-12 col-sm-3">
                    <div className=" col-auto ">
                        <h4><u>DCE list</u></h4>
                        <ul>
                            {dceList.list && dceList.list.map((dce, i)=>{
                                return(
                                    <div key={i} className="">
                                        <h5 className="mt-3"><li className="listRuler mb-1"  data-id={dce.id}> <b>{dce.name}</b>
                                            <hr className="ruler"/> 
                                            <Link to={{pathname:"/app/"+uid+"/"+ dce.id}}>
                                                <button className="btn btn-sm btn-outline-info mx-1" ><i className="material-icons mat-icon mt-1">play_circle_outline</i></button>
                                            </Link>
                                            {dce.grouped&&<button className="btn btn-sm btn-outline-danger mx-1" onClick={()=>{setCurrentDce(dce)}}><i className="material-icons mat-icon mt-1">poll</i></button>} 
                                        </li></h5>
                                    </div>
                                )
                             })}
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
                    <ResultDce  currentDce={currentDce} dceId={currentDce.id} userId={uid} />
                </div>
            </div>
        </div>
    )
}
