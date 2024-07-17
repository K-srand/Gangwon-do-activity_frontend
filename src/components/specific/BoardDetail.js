import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/BoardDetail.css';
import role from '../../assets/images/gamja.png';
import likeIcon from '../../assets/images/likeIcon.png';
import like from '../../assets/images/like.png';
import disLike from '../../assets/images/disLike.png';
import Comment from './Comment'; // Comment 컴포넌트 임포트

function BoardDetail() {
    const { boardNo } = useParams(); // 게시물 번호를 URL에서 추출

    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [boardDetail, setBoardDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [imageAddress , setImgUrl] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 1로 설정
    const [commentCount, setCommentCount] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page')) || 1; // 기본 페이지를 1로 설정

    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    useEffect(() => {
        fetchComments();
    }, [currentPage, boardNo]);

    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:4040/api/v1/board/commentList/${boardNo}?page=${currentPage - 1}&size=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const pageData = response.data;
            setTotalPages(pageData.totalPages);
            setComments(pageData.content);  // 응답 데이터 구조에 맞게 설정
            setCommentCount(pageData.totalElements);
            console.log('댓글 목록:', pageData.content);

            // 현재 페이지가 총 페이지 수를 초과하면 첫 페이지로 리다이렉트
            if (currentPage > pageData.totalPages) {
                navigate(`/BoardDetail/${boardNo}?page=${pageData.totalPages}`);
            }
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            navigate(`/BoardDetail/${boardNo}?page=${newPage}`);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4040/api/v1/auth/sign-in', {
            userId: userId,
            userPassword: userPassword
        })
        .then(function(res){
            const token = res.data.token;
            localStorage.setItem('token', token);
            console.log('로그인 성공:', res);   
            getUser();
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    }

    const getUser = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:4040/api/v1/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            setUserName(res.data.nickname);
            setUserId(res.data.userId);
            console.log('사용자 데이터:', res);
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    }

    const getBoardDetail = () => {
        const token = localStorage.getItem('token');
        
        axios.get(`http://localhost:4040/api/v1/board/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            if (res.data.deletedTime !== null) {
                window.location.href = '/ErrorPage';
            } else {
                setBoardDetail(res.data);
                console.log('게시물 상세정보:', res);
            }
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    
        getImgUrl();
    }

    const getImgUrl = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:4040/api/v1/board/image/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            setImgUrl(res.data);
            console.log('setImgUrlres:', res);
            console.log('setImgUrl', res.data);
            console.log('imageAddress', imageAddress);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }

    useEffect(() => {
        getUser();
        getBoardDetail();
    }, [boardNo]);

    const editClick = () => {
        window.location.href = `/patch/${boardNo}`;
    };

    const deleteClick = () => {
        const userConfirmed = window.confirm('게시물을 삭제하시겠습니까?');
        if (!userConfirmed) {
            return;
        }

        const token = localStorage.getItem('token');
        axios.patch(`http://localhost:4040/api/v1/board/delete/${boardNo}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            console.log('게시물 삭제:', res);
            window.location.href = '/community'; // 삭제 후 커뮤니티 페이지로 이동
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:4040/api/v1/board/comment/${boardNo}`, {
            content: newComment
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            console.log('댓글 등록 성공:', res);
            fetchComments(); // 댓글을 다시 불러와서 페이지 갱신
            setNewComment('');
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    };
    
    return (
        <div className="boardDetail">
            {boardDetail && (
                <>
                    <div className="boardDetail-header">
                        <div className="boardDetail-title">
                            <h1>{boardDetail.boardTitle}</h1>
                        </div>
                        <div className="boardDetail-header-button">
                            <button className="editClick" onClick={editClick}>수정</button>
                            <button className="deleteClick" onClick={deleteClick}>삭제</button>
                        </div>
                    </div>
                    <div className="boardDetail-header-body">
                        <div className="profile">
                            <img src={role} alt="ProfileImage" />
                            <span>{boardDetail.userNick}</span> {/* 작성자 닉네임 표시 */}
                        </div>
                        <div className="liked">
                            <span>
                                <img src={likeIcon} alt="like" />
                                {boardDetail.countLikes}
                            </span>
                            <div className="writtenTime">{new Date(boardDetail.writtenTime).toLocaleString()}</div>
                        </div>
                    </div>
                    <hr className="boardDetail-header-line" />
                    <div className='post-body'>
                        <div className="content">
                            <p>{boardDetail.content}</p>
                        </div>
                        <div className='board-detail-image'>
                            {imageAddress.length > 0 ? (
                                imageAddress.map((url, index) => (
                                    <div key={index} className="image-container">
                                        <img 
                                            src={url} 
                                            className='detail-image'
                                            alt={`Image ${index}`} 
                                        />
                                    </div>
                                ))
                            ) : (
                                null
                            )}
                        </div>
                        <div className="LikeAction-DislikeAction">
                            <img src={like} alt="LikeAction" />
                            <img src={disLike} alt="DislikeAction" />
                        </div>

                        <div className='boardDetail-report'>
                        </div>
                    </div>
                    <Comment 
                        comments={comments} 
                        newComment={newComment}
                        commentCount={commentCount}
                        handleCommentChange={handleCommentChange}
                        handleCommentSubmit={handleCommentSubmit}
                    />
                    <div className="comment-pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage <= 1}
                            className="comment-page-button"
                        >
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button 
                                key={page} 
                                onClick={() => handlePageChange(page)} 
                                className={`comment-page-number ${page === currentPage ? 'active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage >= totalPages}
                            className="comment-page-button"
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default BoardDetail;
