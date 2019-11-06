import React from 'react';
import logo from './logo.svg';
import './app.scss';
import Music from "./components/music"
import Users from "./components/users"
function App() {
  return (
    <div className="App">
      <Users />
      <Music/>
    </div>
  );
}

export default App;
