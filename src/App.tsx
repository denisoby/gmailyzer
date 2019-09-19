import React from 'react';
import './App.css';
import { Popup } from './components/Popup/Popup';
import { Dashboard } from './components/Dashboard/Dashboard';

const App: React.FC = () => {
  let { location } = window;
  return (
    <div className="App">
      {location.hash === '#dashboard' ? <Dashboard></Dashboard> : <Popup></Popup>}
    </div>
  );
};

export default App;
