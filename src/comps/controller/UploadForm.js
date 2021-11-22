import React, { useState } from 'react';
import ProgressBar from '../view/ProgressBar';

const UploadForm = ({ dceId, scNr, setUrl }) => { //Component for uploading image
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ['image/png', 'image/jpeg'];

  //handle selected file
  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {//ensure file type is png or jpeg
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select an image file (png or jpg)');
    }
  };

  //Html to show in browser. Show progressbar while loading
  return (
      <div>
        <label>
          <input type="file" style={{height: 0, width: 0}} onChange={handleChange} />
          <span className="btn btn-sm btn-outline-info mb-3">Upload image</span>
        </label>
        <div className="output">
          { error && <div className="error">{ error }</div>}
          { file && <div>{ file.name }</div> }
          { file && <ProgressBar file={file} setFile={setFile} dceId={dceId} scNr={scNr} setUrl={setUrl}/> }
        </div>
      </div>
    );
}

export default UploadForm;