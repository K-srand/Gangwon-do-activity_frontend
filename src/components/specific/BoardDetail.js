import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/BoardDetail.css';
import likeIcon from '../../assets/images/likeIcon.png';
import like from '../../assets/images/like.png';
import dislike from '../../assets/images/disLike.png';
import Comment from './Comment'; // Comment 컴포넌트 임포트
import rank1 from '../../assets/images/Rank1.png';
import rank2 from '../../assets/images/Rank2.png';
import rank3 from '../../assets/images/Rank3.png';
import rank4 from '../../assets/images/Rank4.png';
import rank5 from '../../assets/images/Rank5.png';
import rankSuper from '../../assets/images/Ranksuper.png';
import defaultImage from '../../assets/images/Icon_No_Image.png';

function BoardDetail() {
    const { boardNo } = useParams(); // 게시물 번호를 URL에서 추출
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [boardNick, setBoardNick] = useState('');
    const [boardDetail, setBoardDetail] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [imageAddress, setImgUrl] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 1로 설정
    const [commentCount, setCommentCount] = useState(0);
    const [userRole, setUserRole] = useState('');
    //좋아요 싫어요 버튼 누름 표시
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false); //서버 응답 받을 때까지 비활성화
    const [myCourse, setMyCourse] = useState([]);

    const [reportedPosts, setReportedPosts] = useState(new Set());
    const [reportedComments, setReportedComments] = useState(new Set());
    const [userExp, setUserExp] = useState("");

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

    useEffect(() => {
        const reportedPostsFromStorage = new Set(JSON.parse(localStorage.getItem('reportedPosts') || '[]'));
        const reportedCommentsFromStorage = new Set(JSON.parse(localStorage.getItem('reportedComments') || '[]'));
        setReportedPosts(reportedPostsFromStorage);
        setReportedComments(reportedCommentsFromStorage);
    }, []);

    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://3.36.27.202:4040/api/v1/board/commentList/${boardNo}?page=${currentPage - 1}&size=5`, {
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
        axios.post('http://3.36.27.202:4040/api/v1/auth/sign-in', {
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
        axios.get('http://3.36.27.202:4040/api/v1/user', {
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
    
        axios.get(`http://3.36.27.202:4040/api/v1/board/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            if (res.data.deletedTime !== null || res.data.censoredTime !== null) {
                // deletedTime 또는 censoredTime이 존재하면 ErrorPage로 이동
                navigate('/ErrorPage');
            } else {
                setBoardDetail(res.data);
                setBoardNick(res.data.userNick);
                setUserExp(res.data.userExp);
                setUserRole(res.data.userRole);
         
                if (res.data.firstImage2 && Array.isArray(res.data.firstImage2)) {
                    const courseDetails = res.data.firstImage2.map(imageObj => ({
                        placeTitle: imageObj.placeTitle,
                        imageUrl: imageObj.firstImage2
                    }));
                    setMyCourse(courseDetails);
                } else {
                    setMyCourse([]);
                }
                console.log('이미지', res.data.firstImage2);
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
        axios.get(`http://3.36.27.202:4040/api/v1/board/image/${boardNo}`, {
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
        // userName이라 되어 있지만 로그인한 사용자 닉네임임
        console.log("userNick :", userName);
        // 여긴 게시글의 닉네임
        console.log("getBoardDetail.userNick", boardNick);
        if(userName !== boardNick){
            alert("본인 작성글이 아닙니다.");
        }else{
            window.location.href = `/patch/${boardNo}`;
        }
    };

    const deleteClick = () => {
        const userConfirmed = window.confirm('게시물을 삭제하시겠습니까?');
        if (!userConfirmed) {
            return;
        }

        const token = localStorage.getItem('token');
        axios.patch(`http://3.36.27.202:4040/api/v1/board/delete/${boardNo}`, {}, {
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
        axios.post(`http://3.36.27.202:4040/api/v1/board/comment/${boardNo}`, {
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
            increExp1();
            alert("댓글 작성으로 경험치 1점을 얻었습니다.")
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    };

    const handleCommentReport = async (commentNo) => {
        const userConfirmed = window.confirm('댓글을 신고하시겠습니까?');
        if (!userConfirmed) {
            return;
        }

        if (reportedComments.has(commentNo)) {
            alert("이미 신고 접수가 되었습니다.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://3.36.27.202:4040/api/v1/report/comment/${commentNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('댓글 신고 성공:', response);
            setReportedComments(prev => {
                const newReportedComments = new Set(prev);
                newReportedComments.add(commentNo);
                localStorage.setItem('reportedComments', JSON.stringify(Array.from(newReportedComments)));
                return newReportedComments;
            });
            alert("댓글 신고가 접수되었습니다.");
        } catch (error) {
            console.error("댓글 신고 중 에러 발생:", error);
            alert("댓글 신고 중 오류가 발생했습니다.");
        }
    };

    const handleLike = () => {
        const token = localStorage.getItem('token');
        setIsButtonDisabled(true); // 버튼 비활성화

        if (isLiked) {
            // 좋아요 취소
            axios.post(`http://3.36.27.202:4040/api/v1/board/like/${boardNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(function(res){
                console.log('좋아요 취소:', res);
                setBoardDetail(prev => ({...prev, countLikes: prev.countLikes - 1}));
                setIsLiked(false);
                localStorage.setItem(`likeState_${boardNo}`, ''); // 좋아요 눌림 상태 해제
            })
            .catch(function(error) {
                console.error("에러 발생!", error);
            });
        } else {
            // 좋아요
            axios.post(`http://3.36.27.202:4040/api/v1/board/like/${boardNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(function(res){
                console.log('좋아요:', res);
                setBoardDetail(prev => ({...prev, countLikes: prev.countLikes + 1}));
                setIsLiked(true);
                setIsDisliked(false);
                localStorage.setItem(`likeState_${boardNo}`, 'liked'); // 좋아요 눌림 상태 지속하려고
            })
            .catch(function(error) {
                console.error("에러 발생!", error);
            });
        }
    };

    const handleDislike = () => {
        const token = localStorage.getItem('token');

        if (isDisliked) {
            // 싫어요 취소
            axios.post(`http://3.36.27.202:4040/api/v1/board/dislike/${boardNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(function(res){
                console.log('싫어요 취소:', res);
                setBoardDetail(prev => ({...prev, countLikes: prev.countLikes + 1}));
                setIsDisliked(false);
                localStorage.setItem(`likeState_${boardNo}`, ''); // 싫어요 눌림 상태 해제
            })
            .catch(function(error) {
                console.error("에러 발생!", error);
            });
        } else {
            // 싫어요
            axios.post(`http://3.36.27.202:4040/api/v1/board/dislike/${boardNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(function(res){
                console.log('싫어요:', res);
                setBoardDetail(prev => ({...prev, countLikes: prev.countLikes - 1}));
                setIsDisliked(true);
                setIsLiked(false);
                localStorage.setItem(`likeState_${boardNo}`, 'disliked'); // 싫어요 눌림 상태 지속하려고
            })
            .catch(function(error) {
                console.error("에러 발생!", error);
            });
        }
    };

    //글 신고
    const handleReportClick = async () => {
        const userConfirmed = window.confirm('신고하시겠습니까?');
        if (!userConfirmed) {
            return;
        }

        if (reportedPosts.has(boardNo)) {
            alert("이미 신고 접수가 되었습니다.");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://3.36.27.202:4040/api/v1/report/board/${boardNo}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('신고 성공:', response);
            setReportedPosts(prev => {
                const newReportedPosts = new Set(prev);
                newReportedPosts.add(boardNo);
                localStorage.setItem('reportedPosts', JSON.stringify(Array.from(newReportedPosts)));
                return newReportedPosts;
            });
            alert("신고가 접수되었습니다.");
        } catch (error) {
            console.error("신고 중 에러 발생:", error);
            alert("신고 중 오류가 발생했습니다.");
        }
    };

    // 작성글에 해당하는 좋아요/싫어요 상태 불러오기
    useEffect(() => {
        const likeState = localStorage.getItem(`likeState_${boardNo}`);
        if (likeState === 'liked') {
            setIsLiked(true);
            setIsDisliked(false);
        } else if (likeState === 'disliked') {
            setIsLiked(false);
            setIsDisliked(true);
        }
    }, [boardNo]);

    // 유저 등급 이미지
    const getRankInfo = (expUser, roleUser) => {
        if(roleUser === 'ROLE_ADMIN'){
            return rankSuper;
        }else{
            if (expUser < 10) {
                return rank1 ;
              } else if (expUser < 50) {
                return  rank2 ;
              } else if (expUser < 100) {
                return  rank3 ;
              } else if (expUser < 150) {
                return  rank4 ;
              } else {
                return  rank5 ;
              }
        }
      };

      // 댓글 점수 올리기
    const increExp1 = async () => {
        try{
        const token = localStorage.getItem('token'); // 토큰 가져오기
        await axios.get('http://3.36.27.202:4040/api/v1/board/increment1/',{
        headers:{
            Authorization: `Bearer ${token}`
        }
        })
        } catch (error) {
        console.error('update exp error:', error);
        }
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
                            <img src={getRankInfo(userExp, userRole)} alt="ProfileImage" />
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
                        {boardDetail.content.split("\n").map((line) => { 
                        return (
                        <span>
                            {line}
                            <br />
                        </span>
                        );
                        })}   
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
                        <div>
                        {myCourse.length ? (
                            <p className='mycourse-board'>내가 추천하는 코스</p>
                        ) : (
                            null
                        )}
                        </div>
                        <div className='myCourse'>
                        {myCourse.length > 0 ? myCourse.map((course, index) => ( 
                            <div className="course-container" key={index}>
                                <img className="course-images" src={course.imageUrl || defaultImage} alt={`image-${index}`} />
                                <h4>{course.placeTitle}</h4>
                                </div>
                        )) : null}   
                        </div>

                        <div className="LikeAction-DislikeAction">
                            <img src={like} alt="LikeAction" onClick={handleLike} className={isLiked ? 'liked' : ''} disabled={isButtonDisabled}/>
                            <img src={dislike} alt="DislikeAction" onClick={handleDislike} className={isDisliked ? 'disliked' : ''} disabled={isButtonDisabled}/>
                        </div>

                        <div className='boardDetail-report'>
                            <span onClick={handleReportClick}>글 신고</span>
                        </div>
                    </div>
                    <Comment 
                        comments={comments} 
                        newComment={newComment}
                        commentCount={commentCount}
                        handleCommentChange={handleCommentChange}
                        handleCommentSubmit={handleCommentSubmit}
                        handleCommentReport={handleCommentReport} // 댓글 신고 함수 전달
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
