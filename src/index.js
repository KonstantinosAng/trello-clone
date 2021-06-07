import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import State from './utils/stateProvider';
import { addCard } from './utils/stateProvider';

ReactDOM.render(
  <React.StrictMode>
    <State.Provider value={{addCard}}>
      <App />
    </State.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
