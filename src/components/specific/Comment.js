import React from 'react';
import rank1 from '../../assets/images/Rank1.png';
import rank2 from '../../assets/images/Rank2.png';
import rank3 from '../../assets/images/Rank3.png';
import rank4 from '../../assets/images/Rank4.png';
import rank5 from '../../assets/images/Rank5.png';
import rankSuper from '../../assets/images/Ranksuper.png';

const Comment = ({ comments, newComment, commentCount, handleCommentChange, handleCommentSubmit, handleCommentReport }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCommentSubmit();
        }
    };

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
                            <img src={getRankInfo(comments[index].userExp, comments[index].userRole)} alt="ProfileImage" onError={(e) => { e.target.src = '/default/profile.png'; }} />
                            <span>{comment.userNick}</span> {/* 작성자 닉네임 표시 */}
                        </div>
                        <div className="comment-content">
                            <span>{comment.content}</span>
                        </div>
                        <div className="comment-z">
                            <div className='comment-report'>
                                <span onClick={() => handleCommentReport(comment.commentNo)}>신고</span>
                            </div>
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
