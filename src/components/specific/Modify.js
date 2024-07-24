import React, { useState, useEffect } from 'react';
import '../../assets/styles/Register.css';
import image from '../../assets/images/MainLogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // 접근성을 위해 설정

function Modify() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  const [formData, setFormData] = useState({
    userName: '',
    userId: '',
    userEmail: '',
    userPassword: '',
    userNewPassword: '',
    passwordConfirm: '',
    userNick: ''
  });

  const [isPasswordMatched, setIsPasswordMatched] = useState(null); // 비밀번호 일치 여부 상태 추가
  const [isNickValid, setIsNickValid] = useState(null); // 닉네임 유효성 상태 추가
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false); // 비밀번호 확인 상태 추가
  const [isNickChecked, setIsNickChecked] = useState(false); // 닉네임 체크 여부 상태 추가, 초기값 false로 설정

  useEffect(() => {
    // LocalStorage에서 토큰 가져오기
    const token = localStorage.getItem('token');

    // API 요청을 통해 사용자 데이터를 가져옴
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4040/api/v1/mypage/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 비밀번호와 비밀번호 확인 필드가 일치하는지 확인
    if (name === 'userNewPassword' || name === 'passwordConfirm') {
      setIsPasswordConfirmed(
        (name === 'userNewPassword' && value === formData.passwordConfirm) ||
        (name === 'passwordConfirm' && value === formData.userNewPassword)
      );
    }

    // 닉네임이 변경되면 닉네임 체크 상태 초기화
    if (name === 'userNick') {
      setIsNickChecked(false);
    }
  };

  const handlePasswordCheck = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:4040/api/v1/mypage/checkpassword', {
        userPassword: formData.userPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { code } = response.data;
      const isMatched = code === 'SU';
      setIsPasswordMatched(isMatched); // 응답 코드가 'SU'이면 비밀번호 일치
      
      if (isMatched) {
        alert('기존 비밀번호와 일치합니다!');
      } 
    } catch (error) {
      console.error('Error checking password:', error);
      setIsPasswordMatched(false);
      alert('기존 비밀번호와 불일치합니다!');
    }
  };

  const handleNickCheck = async () => {
    if (!formData.userNick) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    const nicknameRegex = /^.{6,20}$/;
    if (!nicknameRegex.test(formData.userNick)) {
      alert('닉네임은 6~20자 이내로 작성해야 합니다.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4040/api/v1/auth/check-nickname', {
        userNick: formData.userNick
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      console.log('Nickname Check Response:', result);

      setIsNickValid(result);
      setIsNickChecked(true);
      alert(result ? '사용 가능한 닉네임 입니다!' : '닉네임이 중복됩니다!');
    } catch (error) {
      console.error('Error checking nickname:', error);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    const token = localStorage.getItem('token');
    if (formData.userNick && !isNickChecked) {
      alert('닉네임 중복 체크를 해주세요.');
      return;
    }
    try {
      const response = await axios.patch('http://localhost:4040/api/v1/mypage/modify', {
        userId: formData.userId,
        userPassword: formData.userNewPassword,
        userNick: formData.userNick
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 'SU') {
        alert('정보가 성공적으로 수정되었습니다.');
        navigate('/'); // 정보 수정 성공 시 메인 페이지로 이동
      } else {
        alert('정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error modifying user data:', error);
      alert('정보 수정 중 오류가 발생했습니다.');
    }
  };

  const checkDisable = () => {
    // 기존 비밀번호가 확인되지 않았으면 버튼을 비활성화
    if (!isPasswordMatched) {
      return true;
    }
    // 수정 비밀번호가 입력되었는데 비밀번호 확인이 일치하지 않으면 버튼을 비활성화
    if (formData.userNewPassword && !isPasswordConfirmed) {
      return true;
    }
    // 닉네임이 입력되었는데 닉네임 체크가 완료되지 않았으면 버튼을 비활성화
    if (formData.userNick && !isNickChecked) {
      return true;
    }
    return false;
  };

  return (
    <div className='register-modal-main'>
      <div className='register-modal-logo'>
        <img src={image} alt='로고'></img>
      </div>
        
      <div className='register-modal-welcome'>
        <div className='bold'>Welcome 강추!</div>
        <div className='detail'>위치API 기반 강원도 액티비티 추천 웹 사이트</div>
      </div>

      <div className='register-modal-receive'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor="userName">*이름</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              disabled
            />
          </div>
          <div className='form-group'>
            <label htmlFor="userId">*아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="아이디를 입력해주세요"
              disabled
            />
          </div>
          <div className='form-group'>
            <label htmlFor="userEmail">*이메일</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="example@a.com"
              disabled
            />
          </div>
          <div className='form-group'>
            <label htmlFor="userPassword">*기존 비밀번호</label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              placeholder="영문, 숫자, 특수문자 조합으로 8~20자 이내"
            />
             <button type="button" onClick={handlePasswordCheck}>확인</button>
            
          </div>
          <div className='form-group'>
            <label htmlFor="userNewPassword">*비밀번호 수정</label>
            <input
              type="password"
              id="userNewPassword"
              name="userNewPassword"
              value={formData.userNewPassword}
              onChange={handleChange}
              placeholder="영문, 숫자, 특수문자 조합으로 8~20자 이내"
            />
          </div>
          <div className='form-group'>
            <label htmlFor="passwordConfirm">*비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="사용하실 비밀 번호를 입력해주세요"
            />
          </div>
          <div className='form-group'>
            <label htmlFor="userNick">*닉네임</label>
            <input
              type="text"
              id="userNick"
              name="userNick"
              value={formData.userNick}
              onChange={handleChange}
              placeholder="6~20자 이내의 닉네임"
            />
            <button type="button" onClick={handleNickCheck}>닉네임 체크</button>
          </div>
          <button type="submit" disabled={checkDisable()}>정보 수정</button>
        </form>
      </div>
    </div>
  );
}

export default Modify;
