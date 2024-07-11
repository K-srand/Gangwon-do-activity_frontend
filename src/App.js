import {React, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Test상태인 녀석들 -> 아직 components에서 바로 가져다 쓰는녀석들
import LoginDetail from './components/specific/LoginDetail';
import Register from './components/specific/Register';

//Page 단위 구성까지 끝난 녀석들 -> pages에서 끌어오기.
import MainPage from './pages/MainPage';
import CommunityListPage from './pages/CommunityListPage'; 
import './App.css';
import PostBoard from './pages/PostBoardPage';
import PatchBoard from './pages/PatchBoardPage'

// BoardDetail 컴포넌트 임포트 추가
import BoardDetail from './components/specific/BoardDetail';
import BoardDetailPage from './pages/BoardDetailPage'; 

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
            <Route path="/register" element={<Register/>}/>
            <Route path="/BoardDetail/:boardNo" element={<BoardDetailPage/>}/>
            <Route path="/post" element={<PostBoard/>}/>
            <Route path="/patch/:boardNo" element={<PatchBoard/>}/>
          </Routes>
        </Router>
    </div>

  );
}

export default App;
