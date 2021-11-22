import React, {useState} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import '../../../index.css';
import Option from './Option';

const MenuTabs = ({handleClick, sc1, sc2, dceDescr, ageGender})=>{
//Component for displaying choices in swipable tabs for smartphones

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
    

  const handleChange = (event, newValue) => {//handles change of tab
    setValue(newValue)
    setIndex(
      newValue,
    );
    };

  const handleChangeIndex = (index) => {//handles change of tab index
    setIndex(
      index,
    );
    setValue (index);
  };

  const styles = {//styles for tab
    tabs: {
      background: '#fff',
      },
    label: {
       fontSize: '100%',
      }}

    return (
      <div className="swiper-container">
          <AppBar position="static" color="default">
            <Tabs indicatorColor="primary" textColor="primary" background="primary"
              variant="fullWidth" value={value} onChange={handleChange} style={styles.tabs}>
              <Tab style={styles.label} label="option n°1" />
              <Tab style={styles.label} label="option n°2" />
            </Tabs>
          </AppBar>
        <h5 className="text-secondary mt-1 mb-0 text-center">{dceDescr}</h5>

        <SwipeableViews enableMouseEvents index={index} onChangeIndex={handleChangeIndex}>
          <div className="slide">
            {/* Displays first option  */}
             <div className="innerslide" >
             <Option handleClick={handleClick} sc1={sc1} sc2={sc2} value='A' shownSc={sc1} ageGender={ageGender}/>
             </div> 
              </div>
          <div className="slide">
            {/* Displays second option */}
            <div className="innerslide" >
              <Option handleClick={handleClick} sc1={sc1} sc2={sc2} value='B' shownSc={sc2} ageGender={ageGender}/>
             </div> 
          </div>
        </SwipeableViews>
      </div>
    );
  }


export default MenuTabs;