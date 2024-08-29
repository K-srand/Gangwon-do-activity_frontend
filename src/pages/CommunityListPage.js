import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.js';
import Footer from '../components/common/Footer';
import Community from '../components/specific/Community';

function CommunityPage() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false); // 리디렉션 상태 추가

  useEffect(() => {
    if (!token && !redirecting) {
        alert("로그인 후 이용가능합니다!");
        setRedirecting(true); // 리디렉션이 시작되었음을 표시
        navigate('/logindetail'); // 로그인 페이지 경로로 리디렉션
    }
  }, [token, navigate, redirecting]);

  return (
    <div>
      <Navbar />
      <main>
        <Community token={token} />
      </main>
      <Footer />
    </div>
  );
}

export default CommunityPage;
