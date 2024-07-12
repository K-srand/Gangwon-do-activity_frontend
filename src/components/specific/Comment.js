import React, { useEffect, useState } from 'react';
import profile from '../../assets/images/profile.png';

const Comment = ({ comments, newComment, commentCount, handleCommentChange, handleCommentSubmit }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCommentSubmit();
        }
    };

    return (
        <div className="boardDetail-footer">
            <div className="comment-header">
                <span>댓글 {commentCount}개</span>
            </div>
            <hr className="boardDetail-footer-line" />
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-profile">
                            <img src={profile} alt="ProfileImage" onError={(e) => { e.target.src = '/default/profile.png'; }} />
                            <span>{comment.userNick}</span> {/* 작성자 닉네임 표시 */}
                        </div>
                        <div className="comment-content">
                            <span>{comment.content}</span>
                        </div>
                        <div className="comment-report">
                            <span>{new Date(comment.writtenTime).toLocaleString()}</span> {/* date 대신 writtenTime 사용 */}
                        </div>
                    </div>
                ))
            ) : (
                <div className="comment">
                    <span>댓글이 없습니다.</span>
                </div>
            )}
            <div className="comment-input">
                <input 
                    type="text" 
                    placeholder="댓글 작성" 
                    value={newComment}
                    onChange={handleCommentChange}
                    onKeyPress={handleKeyPress} // Enter 키를 감지하기 위한 이벤트 핸들러
                />
                <button onClick={handleCommentSubmit}>등록</button>
            </div>
        </div>
    );
};

export default Comment;
