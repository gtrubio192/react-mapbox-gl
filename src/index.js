import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.body.appendChild(document.createElement('div'))
);