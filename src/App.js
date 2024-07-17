import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import LoginDetail from './components/specific/LoginDetail';
import Register from './components/specific/Register';
import Certification from './components/specific/Certification';
import BoardDetail from './components/specific/BoardDetail';
import Navbar from './components/common/Navbar'; // 추가
import Modal from './components/specific/Modal'; // 추가
import Login from './components/specific/Login'; // 추가
import './App.css';
import FindId from './components/specific/FindId';
import CertificationId from './components/specific/CertificationId';
import FindPwd from './components/specific/FindPwd';
import CertificationPwd from './components/specific/Certificationpwd';
import CreateMyCoursePage from './pages/CreateMyCoursePage';
import CommunityListPage from './pages/CommunityListPage';
import MainPage from './pages/MainPage';
import Agreement from './components/specific/Agreement';
import IntroducePage from './pages/IntroducePage';

import ErrorPage from './pages/ErrorPage';

// BoardDetail 컴포넌트 임포트 추가
import BoardDetailPage from './pages/BoardDetailPage'; 
import PostBoard from './pages/PostBoardPage';
import PatchBoard from './pages/PatchBoardPage'
import LoadMyCourse from './components/specific/LoadMyCourse';
import RecommendPage from './pages/RecommendPage';


function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    navigate('/');
  };

  React.useEffect(() => {
    if (location.pathname === '/login') {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [location]);

  return (
    <div className="App">
      <Navbar openLoginModal={openModal} /> {/* Navbar에 모달 열기 함수 전달 */}
      <Routes>

        <Route path='/findid' element={<FindId/>}/> 
        <Route path="/certificationid" element={<CertificationId/>}/>
        <Route path='/findpassword' element={<FindPwd/>}/>
        <Route path="/certificationpassword" element={<CertificationPwd/>}/>
        <Route path="logindetail" element={<LoginDetail />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/certification" element={<Certification/>}/>
        <Route path="/community" element={<CommunityListPage />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createmycoursepage" element={<CreateMyCoursePage />} />
        <Route path="/BoardDetail/:boardNo" element={<BoardDetailPage/>}/>
        <Route path="/post" element={<PostBoard/>}/>
        <Route path="/patch/:boardNo" element={<PatchBoard/>}/>
        <Route path="/introduce" element={<IntroducePage/>}/>
        <Route path="/loadmycourse" element={<LoadMyCourse/>}/>
        <Route path="/recommend" element={<RecommendPage/>}/>

        <Route path="/ErrorPage" element={<ErrorPage />} />

      </Routes>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Login />
      </Modal>
    </div>
  );
}

export default App;
