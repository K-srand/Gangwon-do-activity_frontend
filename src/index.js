import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import MyPage from './components/specific/MyPage';

ReactDOM.render(
  // <React.StrictMode>
    <Router>
      {/* <MyPage /> */}
      <App />
    </Router>
  /* </React.StrictMode> */
  ,
  document.getElementById('root')
);
