import React, {useEffect, useState, useContext } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import App from "../participantApp/App";
import SignIn from "../../view/main/SignIn";
import SignUp from "../../view/main/SignUp";
import { UserContext } from "../../../providers/UserProvider";
import PasswordReset from "../../view/main/PasswordReset";
import DceListPage from "../../view/DceListPage";
import DcePlayListPage from "../../view/DcePlayListPage";
import DceList from "../../model/dceList";

function Application() {//loads user and routes to pages depending on user, or to signIn pages when not logged in
  const user = useContext(UserContext);
  const [dceList, setDceList] = useState([]);

  useEffect(() => {
      if(user){
        console.log("user is logged in: "+JSON.stringify(user))
      let getDceList = new DceList(user);//creates new dceList object for this user
      setDceList(getDceList);
      }
    }, [user])

  //dce can be run without logging in. Other dce pages only available for logged in users
  return (
          user ?
          <Switch>
            <Router>
              <Route exact path="/" ><DceListPage dceList={dceList}/></Route>
              <Route exact path="/dcePlayList" ><DcePlayListPage dceList={dceList}/></Route>
              <Route path="/app/:userId/:dceId" exact component={()=> <App/>} />
            </Router>
          </Switch>
          :
          <Switch>
            <Router>
              <Route exact path="/signUp" > <SignUp/></Route>
              <Route exact path="/" > <SignIn  /></Route>
              <Route exact path="/passwordReset" > <PasswordReset /> </Route>
              <Route exact path="/dcePlayList" ><SignIn /></Route>
              <Route path="/app/:userId/:dceId" exact component={()=> <App/>} />

            </Router>
          </Switch>
    );
}
export default Application;