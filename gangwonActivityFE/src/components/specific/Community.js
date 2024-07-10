import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import '../../assets/styles/Community.css';

function Community() {
  const [posts, setPosts] = useState([]); // 상태로 posts 관리

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4040/api/v1/board/list');
        const fetchedPosts = response.data.map(post => ({
          id: post.boardNo,
          author: post.userNick, // userNick을 author로 설정
          content: post.content,
          date: post.writtenTime.split('T')[0], // 날짜만 사용
          notice: false, // 백엔드 데이터에 따라 설정
          best: false // 백엔드 데이터에 따라 설정
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPosts();
  }, []);

  const postCount = posts.length;

  return (
    <div className="community-container">
      <div className="header">
        <h3>전체글 {postCount}개의 글</h3>
        <LinkContainer className="write-button" to="/post">
          <Nav.Link>글 작성</Nav.Link>
        </LinkContainer>
      </div>
      <div className="body">
        <h1 className="title">글 목록</h1>
        <h3 className="right">작성일</h3>
      </div>
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <div className="post-avatar"></div>
            <div className="post-content">
              <span className="post-author">{post.author}</span>
              {post.notice && <span className="post-notice">공지</span>}
              {post.best && <span className="post-best">베스트</span>}
              <span className="post-text">{post.content}</span>
            </div>
            <div className="post-date">{post.date}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(page => (
          <span key={page} className="page-number">{page}</span>
        ))}
        <span className="next-page">다음&gt;</span>
      </div>
    </div>
  );
}

export default Community;
