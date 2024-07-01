
import {React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './components/specific/MainPage';
import LoginDetail from './components/specific/LoginDetail';

import CommunityListPage from './pages/CommunityListPage'; // CommunityPage 경로에 맞게 수정
import './App.css';

function App() {

  return (
    <div className="App">
      <Router>
          {/* <Navbar/> */}
          {/* <LoginDetail/> */}
          {/* <Footer/> */}
          <Routes>
            <Route path= "logindetail" element={<LoginDetail />}/>
            <Route path="/" element={<MainPage />} />
            <Route path="/community" element={<CommunityListPage/>}/>
          </Routes>

        </Router>
    </div>




  );
}

export default App;
