import React, { useState } from "react";
import { pemAuth } from "../../../firebase/config";
import { Link } from "react-router-dom";

const PasswordReset = () => {//Component for reseting password
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    }
  };

  const sendResetEmail = event => {
    event.preventDefault();
    pemAuth
      .sendPasswordResetEmail(email)
      .then(() => {
          setEmailHasBeenSent(true);
        setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };
  return (
    <div className="row justify-content-center">
      <h1 className="text-xl text-center font-bold mb-3">
        Reset your Password
      </h1>
      <div className="col-sm-7">
        <form action="">
          {emailHasBeenSent && (
            <div className="text-danger mb-3">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="text-danger mb-3">
              {error}
            </div>
          )}
                  <div class="form-floating">
          
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            placeholder="Input your email"
            onChange={onChangeHandler}
            className="form-control"
          />
          <label htmlFor="userEmail" className="block">
            Email:
          </label>
          </div>
          <button
            className="btn btn-outline-info my-3"
            onClick={event => {
              sendResetEmail(event);
            }}
          >
            Send me a reset link
          </button>
        </form>

        <Link
          to="/"
          className="my-2 text-blue-700 hover:text-blue-800 text-center block"
        >
          &larr; back to sign in page
        </Link>
      </div>
    </div>
  );
};

export default PasswordReset;