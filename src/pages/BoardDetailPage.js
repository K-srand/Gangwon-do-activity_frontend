import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer.js'; // Footer 경로에 맞게 수정
import BoardDetail from '../components/specific/BoardDetail.js'; // PostWrite 경로에 맞게 수정

function BoardDetailPage() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
        alert("로그인 후 이용가능합니다!");
        navigate('/logindetail'); // 로그인 페이지 경로로 리디렉션
    } 
}, [token, navigate]);
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <BoardDetail token={token} />
      </main>
      <Footer />
    </div>
  );
}

export default BoardDetailPage;