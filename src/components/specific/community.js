import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../assets/styles/Community.css';

function Community() {

  //작성글 리스트
  const posts = [
    { id: 1, author: '관리자', notice: true, content: '날씨 안좋음', date: '2024-06-26' },
    { id: 2, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '2024-06-26' },
    { id: 3, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '2024-06-26' },
    { id: 4, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '2024-06-26' },
    { id: 5, author: '감자', best: false, content: '규진이네 삼겹살..', date: '2024-06-26' },
    { id: 6, author: '감자', best: false, content: '수지네 호텔문..', date: '2024-06-26' },
    { id: 7, author: '감자', best: false, content: '규진이네 삼겹살..', date: '2024-06-26' },
    { id: 8, author: '감자', best: false, content: '수지네 호텔문..', date: '2024-06-26' },
    { id: 9, author: '감자', best: false, content: '규진이네 삼겹살..', date: '2024-06-26' },
    { id: 10, author: '감자', best: false, content: '수지네 호텔문..', date: '2024-06-26' }
  ];

  const postCount = posts.length; //전체글 수 계산

  return (
    <div className="community-container">
      {/* 작성글 헤더 */}
      <div className="header">
        <h3>전체글 {postCount}개의 글</h3>
        <LinkContainer className="write-button" to="/post">
          <Nav.Link>글 작성</Nav.Link>
        </LinkContainer>
      </div>
      
      {/* 글 목록 시작 */}
      <div className="body">
        <h1 className="title">글 목록</h1>
        <h3 className="right">작성일</h3>
      </div>
      <div className="post-list">
        <div className="post-item notice">
        </div>
        {posts.map(post => (
          <div className="post-item">{post.id}&nbsp;&nbsp;
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
      
      {/* 페이지네이션 */}
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
