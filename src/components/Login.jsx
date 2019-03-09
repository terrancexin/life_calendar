import React from 'react';

import '../styles/login.css';
import googleImg from '../assets/google.png';

export default function Login() {
  return (
    <div className="login">
      <h1 className="login__header">Hey, Mate!</h1>
      <p>Log in with Google to see the good times of your life.</p>
      <a href="http://localhost:5000/auth"><img className="googleImg" src={googleImg} alt="googleImg" /></a>
    </div>
  )
}