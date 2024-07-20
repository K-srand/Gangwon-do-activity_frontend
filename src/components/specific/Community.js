import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Community.css';
import { Link } from 'react-router-dom';
import rank1 from '../../assets/images/Rank1.png';
import rank2 from '../../assets/images/Rank2.png';
import rank3 from '../../assets/images/Rank3.png';
import rank4 from '../../assets/images/Rank4.png';
import rank5 from '../../assets/images/Rank5.png';

function Community() {
  const [posts, setPosts] = useState([]); // 현재 페이지의 게시글 목록을 저장
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 1로 설정
  const [bestPosts, setBestPosts] = useState([]); // 주간 베스트 게시글 목록을 저장

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1; // 기본 페이지를 1로 설정
  const [postCount,setPostCount] = useState(0);
  const [userExp, setUserExp] = useState([]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:4040/api/v1/board/?page=${currentPage -1}&size=6`);

        const pageData = response.data; // 페이지 정보 추출
        setTotalPages(pageData.totalPages);
        setPostCount(response.data.totalElements);
        console.log("data? : ", pageData);

        // 현재 페이지가 총 페이지 수를 초과하면 첫 페이지로 리다이렉트
        if (currentPage > pageData.totalPages) {
          navigate(`/community?page=${pageData.totalPages}`);
        } else {
          const fetchedPosts = pageData.content
            .filter(post => !post.deletedTime) // 삭제된 게시물 제외
            .map(post => ({
              id: post.boardNo,
              author: post.userNick, // userNick을 author로 설정
              content: post.content,
              title: post.boardTitle,
              date: post.writtenTime.split('T')[0], // 날짜만 사용
              countViews: post.boardCount, // 조회수 필드 추가
              notice: false, // 백엔드 데이터에 따라 설정
              best: false, // 백엔드 데이터에 따라 설정
              userExp : post.userExp
            }));
          setUserExp(pageData.content.userExp);
          setPosts(fetchedPosts);// 게시글 목록 상태
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    const fetchBestPosts = async () => { // 주간 베스트 게시글을 가져오는 함수 추가
      try {
        const response = await axios.get('http://localhost:4040/api/v1/board/best');
        const fetchedBestPosts = response.data.map(post => ({
          id: post.boardNo,
          author: post.userNick,
          content: post.content,
          title: post.boardTitle,
          date: post.writtenTime.split('T')[0],
          countViews: post.boardCount,
          notice: false,
          best: true,
          userExp : post.userExp
        }));
        setBestPosts(fetchedBestPosts); // 주간 베스트 게시글 목록 상태
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPosts(); // 게시글 목록을 가져옴
    fetchBestPosts(); // 주간 베스트 게시글을 가져옴
  }, [currentPage, navigate]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`/community?page=${newPage}`);
    }
  };

  const getRankInfo = (expUser) => {
    if (expUser < 10) {
      return { img: rank1 };
    } else if (expUser < 50) {
      return { img: rank2 };
    } else if (expUser < 100) {
      return { img: rank3 };
    } else if (expUser < 150) {
      return { img: rank4 };
    } else {
      return { img: rank5 };
    }
  };
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
        {bestPosts.map(post => {
        const { img } = getRankInfo(post.userExp);
        return (
          <div key={post.id} className="post-item">
            <div className="post-avatar">
              <img src={img} alt="dd" />
            </div>
            <div className="post-content">
                <span className="post-author">{post.author}</span>
                {post.best && <span className="post-best">베스트</span>}
                <Link to={`/BoardDetail/${post.id}`} className="post-text">
                  {post.title}
                </Link>
              </div>
              <div className="post-date">{post.date}</div>
              <div className="post-views">조회수: {post.countViews}</div>
          </div>
        );
      })}
        {posts.map(post => {
        const { img } = getRankInfo(post.userExp);
        return (
          <div key={post.id} className="post-item">
            <div className="post-avatar">
              <img src={img} alt="dd" />
            </div>
            <div className="post-content">
              <span className="post-author">{post.author}</span>
              <Link to={`/BoardDetail/${post.id}`} className="post-text">
                {post.title}
              </Link>
            </div>
            <div className="post-date">{post.date}</div>
            <div className="post-views">조회수: {post.countViews}</div>
          </div>
        );
      })}
      </div>
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage <= 1}
          className="page-button"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page} 
            onClick={() => handlePageChange(page)} 
            className={`page-number ${page === currentPage ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= totalPages}
          className="page-button"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Community;
