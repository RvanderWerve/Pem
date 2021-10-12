import React from 'react'

export default function List({aspects, editAspect, deleteAspect}) {
    //Component for displaying aspect list
    return (
        <div>
            <div className=" col-auto ">
                <h4><u>Aspect list</u></h4>
                <ul>
                    {aspects && aspects.map((aspect, i)=>{
                        return(
                        <div className="">
                            <h5 className="mt-3">
                                <li  key={i} className="listRuler mb-1"  data-id={aspect.id}> <b>{aspect.aspectName}</b>
                                    <hr className="ruler"/> 
                                    <button className="btn btn-sm btn-outline-warning" onClick={editAspect}><i className="material-icons mat-icon">edit</i></button>
                                    <button className="btn  btn-outline-success btn-sm mx-2" onClick={deleteAspect}><i className="material-icons mat-icon">delete_forever</i></button>
                                </li>
                            </h5>
                        </div>
                        )
                        })
                    }
                </ul>
            </div>

        </div>
    )
}
