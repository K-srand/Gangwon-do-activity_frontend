import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import PostWrite from '../components/specific/PostWrite'; // PostWrite 경로에 맞게 수정
import Comment from '../components/specific/Comment';

function PostWritePage() {
  return (
    <div>
      <Navbar />
      <main>
        <PostWrite />
      </main>
      <Footer />
    </div>
  );
}

export default PostWritePage;