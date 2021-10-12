import React, { useContext } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import App from "../app/App";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { UserContext } from "../../providers/UserProvider";
import PasswordReset from "./PasswordReset";
import DceList from "../dce/DceList";
import Dces from "../dce/Dces";
import AspectList from "../result/AspectList";

function Application() {//loads user and routes to pages depending on user, or to signIn pages when not logged in
  const user = useContext(UserContext);
  return (
        user ?
        <Switch>
          <Router>
            <Route exact path="/" ><DceList /></Route>
            <Route exact path="/dces" ><Dces /></Route>
            <Route path="/aspectList/:userId/:dceId" exact component={()=> <AspectList/>} />
            <Route path="/app/:userId/:dceId" exact component={()=> <App/>} />
        </Router>
      </Switch>
      :
      <Switch>
        <Router>
          <Route exact path="/signUp" > <SignUp/></Route>
          <Route exact path="/" > <SignIn  /></Route>
          <Route exact path="/passwordReset" > <PasswordReset /> </Route>
          <Route exact path="/dces" ><SignIn /></Route>
          <Route path="/app/:userId/:dceId" exact component={()=> <App/>} />

        </Router>
      </Switch>
  );
}
export default Application;