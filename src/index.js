import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.css';
import './css/materialize.css';
import './index.css';
import MainApp from './comps/controller/main/MainApp';

//main page that triggers all react files and imports css
ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root')
);


