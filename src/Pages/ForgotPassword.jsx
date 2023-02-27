import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onSubmit = async(e) => {
e.preventDefault()
try{
const auth = getAuth()
await sendPasswordResetEmail(auth,email)
toast.success('Email was sent')
}catch(error){
toast.error('coult not reset email')
}
  };

  const onChange = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  };
  return (
    <div className="pageContainer container ">
      <header>
        <p className="pageHeader w-full font-bold">Here you can Rest your password!</p>
      </header>

      <main className="mt-2 w-full">
        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput input input-primary border-zinc-500 w-full"
            placeholder="Enter Your Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <Link className="forgotPasswordLink link-primary underline" to='/sign-in'>Back to Sign In</Link>

          <div className="signInBar text-center">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton btn">
             Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
