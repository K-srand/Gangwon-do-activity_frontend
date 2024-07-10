import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/styles/PostWrite.css';
import role from '../../assets/images/gamja.png';
import likeIcon from '../../assets/images/likeIcon.png';
import like from '../../assets/images/like.png';
import disLike from '../../assets/images/disLike.png';
import profile from '../../assets/images/profile.png';
import Comment from './Comment'; // Comment 컴포넌트 임포트

function PostWrite() {
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
            console.log('Logged in successfully:', res);
            getUser();
        })
        .catch(function(error) {
            console.error("There was an error!", error);
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
            console.log('User data:', res);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
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
            // Assuming comments are included in the board detail response
            setComments(res.data.comments || []);
            console.log('Board detail:', res);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
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
        window.location.href = 'https://www.naver.com';
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
            console.log('Comment submitted:', res);
            const newCommentObj = {
                profileImage: profile,
                author: userName,
                content: newComment,
                date: new Date().toLocaleString(),
            };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    };

    return (
        <div className="PostWrite">
            {boardDetail && (
                <>
                    <div className="PostWrite-header">
                        <div className="post-title">
                            <h1>{boardDetail.boardTitle}</h1>
                        </div>
                        <div className="PostWrite-header-button">
                            <button className="editClick" onClick={editClick}>수정</button>
                            <button className="deleteClick" onClick={deleteClick}>삭제</button>
                        </div>
                    </div>
                    <div className="PostWrite-header-body">
                        <div className="profile">
                            <img src={role} alt="ProfileImage" />
                            <span>{`dtd${userName}`}</span>
                        </div>
                        <div className="liked">
                            <span>
                                <img src={likeIcon} alt="like" />
                                {boardDetail.countLikes}
                            </span>
                            <div className="writtenTime">{new Date(boardDetail.writtenTime).toLocaleString()}</div>
                        </div>
                    </div>
                    <hr className="PostWrite-header-line" />
                    <div className='post-body'>
                        <div className="content">
                            <p>{boardDetail.content}</p>
                        </div>
                        {/* 이미지 추가 작업 */}
                        <div>
                            {imageAddress.length > 0 ? (
                                imageAddress.map((url, index) => (
                                    <div key={index} className="image-container">
                                        <img 
                                            src={imageAddress[`${index}`]} 
                                            
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

export default PostWrite;
