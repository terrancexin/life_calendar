import React, { useEffect, useState } from 'react';

import '../styles/app.css';
import Login from './Login';
import Events from './Events';
import Footer from './Footer';

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetchLoginAPI()
  }, []);

  return (
    <div className="app">
      <h1>Life Calendar</h1>
      {isAuth && <button onClick={handleLogOut}>Log out</button>}
      {isAuth ? <Events /> : <Login />}
      <Footer />
    </div>
  );

  async function fetchLoginAPI() {
    try {
      const res = await fetch('/login')
      const { isAuth } = await res.json();

      setIsAuth(isAuth);
    } catch(e) {
      setIsAuth(false)
      console.log(e);
    }
  }

  function handleLogOut(e) {
    e.preventDefault();

    fetch('/logout')
      .then(res => res.json())
      .then(({ isAuth }) => setIsAuth(isAuth))
      .catch(err => console.log(`logout error: ${err}`));
  }
}
