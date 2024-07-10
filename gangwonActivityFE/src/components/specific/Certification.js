import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/MainLogo.png';
import '../../assets/styles/Certification.css';

function Certification() {
  const [certificationNumber, setCertificationNumber] = useState('');
  const navigate = useNavigate();
  const email = sessionStorage.getItem('email');

  useEffect(() => {
    if (!email) {
      alert('이메일 정보가 없습니다. 다시 인증을 시도해주세요.');
      navigate('/'); // 이메일 정보가 없으면 메인 페이지로 리디렉션
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    setCertificationNumber(e.target.value);
  };

  const handleCheck = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4040/api/v1/auth/check-certification', {
        email,
        certificationNumber
      }, {
        headers: {
          'Content-Type': 'application/json'
        }, 
       
      });

      if (response.data.code === 'SU') {
        alert('이메일 인증에 성공하였습니다.');
        navigate('/');
      } else {
        alert('이메일 인증에 실패하였습니다: ' + (response.data.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='certification-modal-main'>
      <div className='certification-modal-main-logo'>
        <img src={logo} alt='Logo'></img>
      </div>
      <div className='certification-modal-main-check-textbox'>
        <div className='bold'>회원 인증 가입 메일</div>
        <div className='detail'>본 이메일은 강추 사이트 회원 가입을 위한 필수 사항입니다.</div>
      </div>

      <form onSubmit={handleCheck}>
        <div className='form-group'>
          <label htmlFor='certificationNumber'>*인증번호</label>
          <input 
            type="text" 
            id="certificationNumber" 
            name="certificationNumber-input" 
            placeholder="인증번호 5자리를 입력해주세요" 
            required 
            value={certificationNumber} 
            onChange={handleChange} 
            pattern="\d{5}" // 5자리 숫자만 입력 가능하도록 제한
            maxLength="5" // 최대 5자리로 제한
            className="certificationNumber-input"
          />
        </div>
        <button type="submit">확인</button>
      </form>
    </div>
  );
}

export default Certification;

