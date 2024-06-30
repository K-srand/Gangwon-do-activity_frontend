import React from 'react';
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar';
import LoginDetail from './components/specific/LoginDetail';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  return (
    <div className="App">
        {/* <Navbar/> */}
        <LoginDetail/>
        {/* <Footer/> */}
    </div>
  );
}

export default App;
