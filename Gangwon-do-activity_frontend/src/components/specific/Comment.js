import React from 'react';
import profile from '../../assets/images/profile.png';

const Comment = ({ comments, newComment, handleCommentChange, handleCommentSubmit }) => {
    return (
        <div className="postWrite-footer">
            <div className="comment-header">
                <span>댓글 {comments.length}개</span>
            </div>
            <hr className="PostWrite-footer-line" />
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-profile">
                            <img src={profile} alt="ProfileImage" onError={(e) => { e.target.src = '/default/profile.png'; }} />
                            <span>{comment.author}</span>
                        </div>
                        <div className="comment-content">
                            <span>{comment.content}</span>
                        </div>
                        <div className="comment-actions">
                            <span onClick="#">신고</span>
                            <span>{comment.date}</span>
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
                />
                <button onClick={handleCommentSubmit}>등록</button>
            </div>
        </div>
    );
};

export default Comment;
