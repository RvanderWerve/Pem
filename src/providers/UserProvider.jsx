import React, { Component, createContext } from "react";
import { pemAuth, generateUserDocument } from '../firebase/config';

export const UserContext = createContext({ user: null });

class UserProvider extends Component {//Component to provide username via Context if user is logged in
    state = {
      user: null
    };
  
    //sets user when authenticated
    componentDidMount = async () => {
      pemAuth.onAuthStateChanged(async userAuth => {
        const user = await generateUserDocument(userAuth);
        this.setState({ user });
        console.log("User logged in");
      });
    };
  
    render() {
      const { user } = this.state;
  
      return (
        <UserContext.Provider value={user}>
          {this.props.children}
        </UserContext.Provider>
      );
    }
  }
  
  export default UserProvider;