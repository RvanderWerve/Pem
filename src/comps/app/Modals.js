
const Modals = ({sc1, sc2}) => {
//Component for displaying modals

    return ( 
        <div>
            
         {/* //Modal for showing additional explanation during dce */}
            <div id="modal1" data-id="modal1" className="modal">
                <div className="modal-content black-text modal-close center">
                    <div className="flow-text"  >
                        <h4 className="mb-3">Additional explanation:</h4>
                        <h6><u>Scenario 1:</u></h6>
                        {sc1&&<p className="flow-text">{sc1.data.scExpl}</p>}
                        {sc1&&sc1.data.scExpl.length===0&&<h5 className="">No additional explanation available</h5>}
                        <h6><u>Scenario 2:</u></h6>
                        {sc2&&<p className="flow-text">{sc2.data.scExpl}</p>}
                        {sc2&&sc2.data.scExpl.length===0&&<h5 className="">No additional explanation available</h5>}

                        <button className="btn btn-sm blue darken-2 waves-effect waves-light z-depth-2">Close</button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Modals;