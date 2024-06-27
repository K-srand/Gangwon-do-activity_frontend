import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../assets/styles/Community.css';

function Community() {
  const posts = [
    { id: 1, author: '관리자', best: true, content: '*공지*', date: '날씨 안좋음' },
    { id: 2, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '날씨 완죤쥬음' },
    { id: 3, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '' },
    { id: 4, author: '감자', best: true, content: '양양 정석이에 서핑 갔는데..', date: '' },
    { id: 5, author: '감자', best: false, content: '규전이네 삼겹살..', date: '' },
    { id: 6, author: '감자', best: false, content: '수제네 호텔문..', date: '' },
    { id: 7, author: '감자', best: false, content: '규전이네 삼겹살..', date: '' },
    { id: 8, author: '감자', best: false, content: '수제네 호텔문..', date: '' },
    { id: 9, author: '감자', best: false, content: '규전이네 삼겹살..', date: '' },
    { id: 10, author: '감자', best: false, content: '수제네 호텔문..', date: '' }
  ];

  return (
    <div className="community-container">
      <div className="header">
        <h1>글 목록</h1>
    
          <LinkContainer className="write-button" to="/post">
            <Nav.Link>글 작성</Nav.Link>
          </LinkContainer>
        
      </div>
      <div className="post-list">
        <div className="post-item notice">
          <span className="post-title">*공지* 날씨 완죤쥬음</span>
        </div>
        {posts.map(post => (
          <div className="post-item" key={post.id}>
            <div className="post-avatar"></div>
            <div className="post-content">
              <span className="post-author">{post.author}</span>
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
