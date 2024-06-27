import React, {useState } from 'react';
import '../../assets/styles/Community.css';
import '../../assets/styles/post.css'

function Community() {
    const [textInput, setTextInput] = useState('');

    const handleInputChange = (e) => {
        setTextInput(e.target.value);
    };

  return (
    <div className="community-container">
      <div className="header">
        <h1>규진이네 삼겹살....</h1>
        <textarea
            rows={10}
            cols={50}
            value={textInput}
            onChange={handleInputChange}
            placeholder="여기에 글을 작성해 주세요..."
        />
        <button className="write-button">취소</button>
        <button className="write-button">완료</button>
      </div>
    </div>
  );
}

export default Community;
