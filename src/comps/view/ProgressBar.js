import React, { useCallback, useEffect } from 'react';
import useStorage from '../../firebase/useStorage';

//Component for showing progressbar when uploading images in a scenario
const ProgressBar = ({ file, setFile, dceId, scNr, setUrl }) => {
  const { progress, url } = useStorage(file, dceId, scNr);

// useCallback to enable use of proper dependencies
const creatUrl = 
useCallback ((url)=>{
  setUrl(url);
},[setUrl])


  //set file and url when url (from storage) changes 
  useEffect(() => {
    if (url) {
      setFile(null);
      creatUrl(url);
    }
  }, [url, setFile, creatUrl]);


    //Html to show in browser
  return (
    <div className="progress-bar"
      style={{ width: progress + '%' }}
    ></div>
  );
} 

export default ProgressBar;