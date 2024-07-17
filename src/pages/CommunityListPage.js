import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import Community from '../components/specific/Community'; // Community 경로에 맞게 수정

function CommunityPage() {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <Community />
      </main>
      <Footer />
    </div>
  );
}

export default CommunityPage;
