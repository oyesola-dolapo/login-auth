import React, { useState, createContext } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { auth, googleAuth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export const authContext = createContext();

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [emailUsed, setEmailUsed] = useState(false);
  const [loginErr, setLoginErr] = useState(false);

  const changeState = () => {
    setSignedUp(!signedUp);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      changeState();
    } catch (err) {

      if (err.code === "auth/email-already-in-use") {
        setEmailUsed(true);
      }
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Successful");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setLoginErr(true);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
    } catch (err) {
      alert(err.code);
    }
  };

  const values = {
    handleEmail,
    handlePassword,
    handleSignUp,
    handleSignIn,
    handleGoogleSignUp,
    changeState,
    emailUsed,
    loginErr,
  };

  return (
    <section className="z-[1]">
      <authContext.Provider value={{ ...values }}>
        {signedUp ? <SignIn /> : <SignUp />}
      </authContext.Provider>
    </section>
  );
}
