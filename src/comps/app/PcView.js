import Option from './Option';

const PcView = ({handleClick, sc1, sc2, dceDescr, ageGender }) => {
    //Component for displaying choices on larger screen like pc, options are next to eachother

    return ( 
        <div className="pc-view">
            <h5 className="text-secondary mt-1 mb-1">{dceDescr}</h5>
            <div className="pc-container">
                {/* Displays first option  */}
                <div className="option-container">
                    <Option handleClick={handleClick} sc1={sc1} sc2={sc2} value='A' shownSc={sc1} ageGender={ageGender}/>
                </div>
                {/* Displays second option */}
                <div className="option-container">
                    <Option handleClick={handleClick} sc2={sc2} sc1={sc1} value='B' shownSc={sc2} ageGender={ageGender}/>
                </div>
             </div>
        </div>
     );
}
 
export default PcView;