import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
            setBoardDetail(res.data);
            console.log('게시물 상세정보:', res);
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    
        // 댓글 리스트를 가져오는 요청 추가
        axios.get(`http://localhost:4040/api/v1/board/commentList/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            setComments(res.data.content);  // 응답 데이터 구조에 맞게 설정
            console.log('댓글 목록:', res.data.content);
        })
        .catch(function(error) {
            console.error("에러 발생!", error);
        });
    }
    {/* 이미지 추가 작업*/}
    const getImgUrl = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:4040/api/v1/board/image/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            // setImgUrl(res.data.imageAddress);
            setImgUrl(res.data);
            console.log('setImgUrlres:', res);
            console.log('setImgUrl', res.data)
            console.log('imageAddress', imageAddress);
            
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }

    {/* 이미지 추가 작업 완료*/}
    

    useEffect(() => {
        getUser();
        getBoardDetail();
        getImgUrl();
    }, [boardNo]);

    const editClick = () => {
        window.location.href = `/patch/${boardNo}`;
    };

    const deleteClick = () => {
        // 사용자에게 삭제 확인을 요청하는 알림 창 표시
        const userConfirmed = window.confirm('게시물을 삭제하시겠습니까?');
    
        if (!userConfirmed) {
            // 사용자가 취소 버튼을 눌렀을 경우
            return;
        }
    
        // 사용자가 확인 버튼을 눌렀을 경우 삭제 요청 진행
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
            const newCommentObj = {
                userNick: userName, // author 대신 userNick 사용
                content: newComment,
                writtenTime: new Date().toISOString(), // date 대신 writtenTime 사용
            };
            setComments([...comments, newCommentObj]);
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
                        {/* 이미지 추가 작업 */}
                        <div className='board-detail-image'>
                            {imageAddress.length > 0 ? (
                                imageAddress.map((url, index) => (
                                    <div key={index} className="image-container">
                                        <img 
                                            src={imageAddress[`${index}`]} 
                                            className='detail-image'
                                            alt={`Image ${index}`} 
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        {/* 이미지 추가 작업 완료 */}
                        <div className="LikeAction-DislikeAction">
                            <img src={like} alt="LikeAction" />
                            <img src={disLike} alt="DislikeAction" />
                        </div>

                        <div className='boardDetail-report'>
                        {/* <span onClick="#">글 신고</span> */}
                        </div>

                    </div>
                    <Comment 
                        comments={comments} 
                        newComment={newComment}
                        handleCommentChange={handleCommentChange}
                        handleCommentSubmit={handleCommentSubmit}
                    />
                    <div className="pagination">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(page => (
                            <span key={page} className="page-number">{page}</span>
                        ))}
                        <span className="next-page">다음&gt;</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default BoardDetail;
