import React, { useState, useEffect, useCallback } from 'react';
import logo from '../../assets/images/MainLogo.png';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 3600000; // 60분을 밀리초로 표현한 값

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!token) setIsLoggedIn(false);;

    axios.get(API_DOMAIN + '/user', {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    })

  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('userRole');
    if (token && userId && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }

    let logoutTimer;

    const resetLogoutTimer = () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      logoutTimer = setTimeout(logout, AUTO_LOGOUT_TIME);
    };

    const handleActivity = () => {
      resetLogoutTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    resetLogoutTimer();

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [logout]);

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃을 하시겠습니까?");
    if (confirmed) {
      logout();
    }
  };

  const handleMyPageClick = () => {
    if (userRole === 'ROLE_ADMIN') {
      navigate('/Admin');
    } else {
      navigate('/mypage');
    }
  };

  return (
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
            
          <a href="/" className="navbar-logo"><img src={logo} alt="Logo" /></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link" href="/introduce">사이트 소개</a>
              <a class="nav-link" href="/community">커뮤니티</a>
              <a class="nav-link" href="/recommend">사용자 추천 코스</a>
              {isLoggedIn && <a class="nav-link" href="/createmycoursepage">나만의 코스 만들기</a>}
            </div>
          </div>
          {isLoggedIn ? (
              <>
                <button type="button" class="btn btn-primary" onClick={handleMyPageClick} >마이페이지</button>
                <button type="button" class="btn btn-primary" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <button type="button" class="btn btn-primary" onClick={() => navigate('/login')}>로그인</button>
            )}
        </div>
      </nav>
  );
};

export default Navbar;
