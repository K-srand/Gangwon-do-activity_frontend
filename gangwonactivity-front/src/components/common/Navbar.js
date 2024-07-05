import React from 'react';
import '../../assets/styles/Navbar.css'; // 상대 경로로 CSS 파일 import
import logo from '../../assets/images/MainLogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-user">
        <a href="/logindetail">로그인</a>
        <a href="www.naver.com">마이페이지</a>
      </div>
      <div className="navbar-logoandlinks">
        <a href= "/" className="navbar-logo" >
          <img src={logo} alt="Logo" />
          {/* <span>액티비티 강추</span> */}
        </a>
        <div className="navbar-links">
          <a href="www.naver.com">사이트 소개</a>
          <a href="/community">커뮤니티</a>
          <a href="www.naver.com">*사용자 추천 코스*</a>
          <a href="www.naver.com">나만의 코스 만들기</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;