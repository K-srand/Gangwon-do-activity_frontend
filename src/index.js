import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// 기존의 ReactDOM.render 코드를 주석 처리했습니다.
// ReactDOM.render(
//   // <React.StrictMode>
//     <Router>
//       <App />
//     </Router>
//   /* </React.StrictMode> */
//   ,
//   document.getElementById('root')
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
