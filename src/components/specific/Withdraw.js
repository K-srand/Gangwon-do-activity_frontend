import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/images/MainLogo.png'; // 로고 import 추가

function Withdraw() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // 로컬 저장소에서 토큰 가져오기
      const response = await axios.post('http://223.130.138.174:4040/api/v1/mypage/deleteuser', {
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
   
      // 여기서 응답 코드가 SU인지 확인
      if (response.data.code === 'SU') {
        alert('탈퇴가 완료되었습니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/'; // 메인 페이지로 이동하고 새로고침
      } else {
        alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('탈퇴 요청 중 오류 발생:', error);
      alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='certification-modal-main'>
      <div className='certification-modal-main-logo'>
        <img src={logo} alt='Logo'></img>
      </div>
      <div className='certification-modal-main-check-textbox'>
        <div className='bold'>회원 탈퇴 시, 모든 기록은 말소됩니다.</div>
        <div className='detail'>회원 탈퇴를 원하신다면 아이디를 입력해주세요.</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='form-delete'>
          <input 
            type="text"
            value={userId}
            onChange={handleInputChange}
            placeholder="아이디 입력" 
          />
        </div>
        <button type="submit">확인</button>
      </form>
    </div>
  );
}

export default Withdraw;
