import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import PostBoard from '../components/specific/PostBoard.js'; // PostBoard 경로에 맞게 수정

function PostBoardPage(){
    return(
        <div>
      <Navbar />
      <main>
        <PostBoard />
      </main>
      <Footer />
    </div>
    )
}

export default PostBoardPage;