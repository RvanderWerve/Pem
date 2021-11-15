import React, {useState} from "react";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "../../../firebase/config";
import { pemAuth } from "../../../firebase/config";

const SignIn = () => {//Sign in page. Provides methodes for signing in with email or google
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const signInWithEmailAndPasswordHandler = 
            (event,email, password) => {
                event.preventDefault();
                pemAuth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    setError("Error signing in with password and email!");
                      console.error("Error signing in with password and email", error);
                    });
    };

      const onChangeHandler = (event) => {
          const {name, value} = event.currentTarget;

          if(name === 'userEmail') {
              setEmail(value);
          }
          else if(name === 'userPassword'){
            setPassword(value);
          }
      };

  return (
    <div className="row justify-content-center">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
      <div className="col-sm-7">
        {error !== null && <div className = "text-danger mb-3">{error}</div>}
        <form className="">
        <div className="form-floating">
           <input
            type="email"
            className="form-control"
            name="userEmail"
            value = {email}
            placeholder="Your email"
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          />
          <label htmlFor="userEmail" className="block">
            Email:
          </label>
          </div>

          <div className="form-floating ">
          <input
            type="password"
            className="form-control"
            name="userPassword"
            value = {password}
            placeholder="Your Password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          />
             <label htmlFor="userPassword" className="block">
            Password:
          </label>
          </div>
          <button className="btn btn-outline-info" onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Sign in
          </button>
        </form>
        <p className="my-3">or</p>
        <button
          className="btn btn-outline-info" onClick={() => {
            signInWithGoogle();
          }}>
          Sign in with Google
        </button>
        <p className="my-3">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link to = "passwordReset" className="text-blue-500 hover:text-blue-600">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;