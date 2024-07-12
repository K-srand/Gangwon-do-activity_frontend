import React, { useState, useEffect } from 'react';
import '../../assets/styles/Navbar.css';
import logo from '../../assets/images/MainLogo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃을 하시겠습니까?");
    if (confirmed) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-user">
        {isLoggedIn ? (
          <>
            <a href="www.naver.com">마이페이지</a>
            <button className='nav-button' onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <button className='nav-button' onClick={() => navigate('/login')}>로그인</button>
        )}
      </div>
      <div className="navbar-logoandlinks">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </a>
        <div className="navbar-links">
          <a href="www.naver.com">사이트 소개</a>
          <a href="/community">커뮤니티</a>
          <a href="www.naver.com">*사용자 추천 코스*</a>
          {isLoggedIn && <a href="/createmycoursepage">나만의 코스 만들기</a>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
