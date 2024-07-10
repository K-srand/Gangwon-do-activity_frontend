import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import CreateMyCoursePage from './pages/CreateMyCoursePage';
import LoginDetail from './components/specific/LoginDetail';
import Register from './components/specific/Register';
import MainPage from './pages/MainPage';
import CommunityListPage from './pages/CommunityListPage';
import Certification from './components/specific/Certification';



import Navbar from './components/common/Navbar'; // 추가
import Modal from './components/specific/Modal'; // 추가
import Login from './components/specific/Login'; // 추가
import './App.css';

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
        <Route path="logindetail" element={<LoginDetail />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/certification" element={<Certification/>}/>
        <Route path="/community" element={<CommunityListPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createmycoursepage" element={<CreateMyCoursePage />} />
      </Routes>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Login />
      </Modal>
    </div>
  );
}




export default App;
