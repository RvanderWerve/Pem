import React, { useState } from "react";
import { Link } from "react-router-dom";
import { pemAuth, signInWithGoogle, generateUserDocument } from "../../../firebase/config";

const SignUp = () => { //Sign up page. Either via mail address or Google account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const createUserWithEmailAndPasswordHandler =async (event, email, password) => {
    event.preventDefault();
    try{
        const {user} = await pemAuth.createUserWithEmailAndPassword(email, password);
        generateUserDocument(user, {displayName});
      }
      catch(error){
        setError('Error Signing up with email and password');
      }
    setEmail("");
    setPassword("");
    setDisplayName("");
  };
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };
  return (
    <div className="row justify-content-center">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign Up</h1>
      <div className="col-sm-7">
        {error !== null && (
          <div className="text-danger mb-3">
            {error}
          </div>
        )}
        <form className="">
        <div className="form-floating">     
          <input
            type="text"
            className="form-control "
            name="displayName"
            value={displayName}
            placeholder="Display name"
            id="displayName"
            onChange={event => onChangeHandler(event)}
          />
           <label htmlFor="displayName" className="block">
            Display Name:
          </label>
        </div>
        <div className="form-floating">     
           <input
            type="email"
            className="form-control"
            name="userEmail"
            value={email}
            placeholder="Your Email"
            id="userEmail"
            onChange={event => onChangeHandler(event)}
          />
           <label htmlFor="userEmail" className="block">
            Email:
          </label>
          </div>
          <div className="form-floating">     
          <input
            type="password"
            className="form-control"
            name="userPassword"
            value={password}
            placeholder="Your Password"
            id="userPassword"
            onChange={event => onChangeHandler(event)}
          />
          <label htmlFor="userPassword" className="block">
            Password:
          </label>
          </div>
          <button
            className="btn btn-outline-info"
            onClick={event => {
              createUserWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign up
          </button>
        </form>
        <p className="my-3">or</p>
        <button
          className="btn btn-outline-info"
          onClick={() => {
            try {
              signInWithGoogle();
            } catch (error) {
              console.error("Error signing in with Google", error);
            }
        }}
        >
          Sign In with Google
        </button>
        <p className="my-3">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Sign in here
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};
export default SignUp;