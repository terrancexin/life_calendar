import React, { useEffect, useState } from 'react';

import '../styles/app.css';
import Login from './Login';
import Events from './Events';

export default function App() {
  const [token, setToken] = useState(false);

  useEffect(() => {
    fetchTokenAPI()
  }, []);

  return (
    <div className="app">
      <h1>Life Calendar</h1>
      {token && <button onClick={handleLogOut}>Log out</button>}
      {token ? <Events /> : <Login />}
    </div>
  );

  async function fetchTokenAPI() {
    try {
      const res = await fetch('/token')
      const { token } = await res.json();

      setToken(token);
    } catch(e) {
      setToken(false)
      console.log(e);
    }
  }

  function handleLogOut(e) {
    e.preventDefault();

    fetch('/logout')
      .then(res => res.json())
      .then(({ token }) => setToken(token))
      .catch(err => console.log(`logout error: ${err}`));
  }
}
