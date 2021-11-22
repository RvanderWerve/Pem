import { useState, useEffect } from "react";

const Option = ({handleClick, sc1, sc2, value, shownSc, ageGender}) => {
//Component that contains option details and feeds back result of choice

  const [choiceValue, setChoiceValue] = useState({})
  //sets choicevalue depending on choice made during experiment
  
  useEffect(() => {//creates object with preferred an non-preferred values derived from choice
        if(sc1&&sc2){
          let fValues1 = sc1.fValues;
          let fValues2 = sc2.fValues;
          let cValue = null;
          if(value==='A'){
            cValue = {pref: {...fValues1, ...ageGender}, nonPref: {...fValues2, ...ageGender}}
          }
          if(value==='B'){
            cValue = {pref: {...fValues2, ...ageGender}, nonPref: {...fValues1, ...ageGender}}
          }
          setChoiceValue(cValue);
        }
      }, [sc1, sc2, ageGender, value])
      
  //Shows text and images on the screen
  return ( 
      <div className="swiper-slide choose-btn">
        <div className="s10 ">
          {shownSc&&<div className="choice-container">
              <p>{shownSc.scText}</p>
              <img className = "swipe-img choice-container" src={shownSc.scImg} alt=""/>
          </div>}
        </div>
        {shownSc&&<button value={value} onClick={()=>{handleClick(choiceValue)}} className="btn blue darken-2 waves-effect waves-light z-depth-2">Choose</button>}
      </div>
  );
}
 
export default Option;