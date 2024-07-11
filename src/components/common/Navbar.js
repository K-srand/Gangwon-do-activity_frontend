import React from 'react';
import '../../assets/styles/Navbar.css';
import logo from '../../assets/images/MainLogo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-user">
        <button className='nav-button'  onClick={() => navigate('/login')}>로그인</button>
        <a href="www.naver.com">마이페이지</a>
      </div>
      <div className="navbar-logoandlinks">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </a>
        <div className="navbar-links">
          <a href="www.naver.com">사이트 소개</a>
          <a href="/community">커뮤니티</a>
          <a href="www.naver.com">*사용자 추천 코스*</a>
          <a href="/createmycoursepage">나만의 코스 만들기</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
