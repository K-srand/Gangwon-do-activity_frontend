import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer.js'; // Footer 경로에 맞게 수정
import BoardDetail from '../components/specific/BoardDetail.js'; // PostWrite 경로에 맞게 수정

function BoardDetailPage() {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <BoardDetail />
      </main>
      <Footer />
    </div>
  );
}

export default BoardDetailPage;