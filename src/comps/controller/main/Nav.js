import  React, { useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import {pemAuth} from "../../model/firebase/config";
import logo from "../../../img/pem50.png"
import { UserContext } from "../../../providers/UserProvider";



function Navigation(props) {
     //Nav component with menu items. User name is shown when logged in.
     const user = useContext(UserContext);

  useEffect(() => {
                    let displayName;
                    if(user){
                            displayName = user.displayName
                            }
                    else {displayName=''}
                  }, [user])

  return (
      <div className="navigation">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src={logo} width='35px' height='30px' alt="PEM logo" />
            </Link>
            <div>
              <ul className="navbar-nav ml-auto">
                <li key="0"
                  className={`nav-item  ${
                    props.location.pathname === "/" ? "active" : ""
                  }`}>
                  <Link className="nav-link" to="/">
                    Develop
                  </Link>
                </li>
                <li key="1"
                  className={`nav-item  ${
                    props.location.pathname === "/dcePlayList" ? "active" : ""
                  }`}>
                  <Link className="nav-link" to="/dcePlayList">
                  Run/Results
                  </Link>
                </li>
                {user? <li key="2" className="nav-item">
                          <Link to="/" className="nav-link" onClick = {() => {pemAuth.signOut()}}>Sign out ({user.displayName})</Link>
                        </li>
                    : <li key="2" className="nav-item">
                        <Link to="/" className="nav-link" >Sign in</Link>
                      </li>}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
}

export default withRouter(Navigation);