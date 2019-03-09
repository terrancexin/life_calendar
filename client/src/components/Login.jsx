import React from 'react';

import '../styles/login.css';
import googleImg from '../assets/google.png';

const authUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_AUTH_URL_PROD : 'http://localhost:5000/auth';

export default function Login() {
  return (
    <div className="login">
      <h1 className="login__header">Hey, Mate!</h1>
      <p>Log in with Google to see the good times of your life.</p>
      <a href={authUrl}><img className="googleImg" src={googleImg} alt="googleImg" /></a>
    </div>
  )
}