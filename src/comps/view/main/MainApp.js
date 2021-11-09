import React  from "react";
import { HashRouter as Router } from "react-router-dom";
import Nav from "./Nav";
import UserProvider from "../../../providers/UserProvider";
import Application from "./Application";



function MainApp() {//Main module with Nav header and application wrapped in UserProvider component

  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Nav />
          <Application/>
        </UserProvider>
      </Router>
    </div>
  );
}

export default MainApp;