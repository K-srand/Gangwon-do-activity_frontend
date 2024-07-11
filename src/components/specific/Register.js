import React, { useState } from 'react';
import '../../assets/styles/Register.css';
import image from '../../assets/images/MainLogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Certification from './Certification'; // Certification 컴포넌트 import

Modal.setAppElement('#root'); // 접근성을 위해 설정

function Register() {
  const [isIdValid, setIsIdValid] = useState(null);
  const [isNickValid, setIsNickValid] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [form, setForm] = useState({
    userName: '',
    userId: '',
    userEmail: '',
    userPassword: '',
    passwordConfirm: '',
    userNick: ''
  });
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    if (name === 'userPassword') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    setIsPasswordValid(passwordRegex.test(password));
  };

  const handleIdCheck = async () => {
    if (!form.userId) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('http://localhost:4040/api/v1/auth/check-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: form.userId })
      });

      const result = await response.json();
      console.log('ID Check Response:', result);

      setIsIdValid(result);
      alert(result ? '아이디 사용 가능' : '아이디가 이미 사용 중입니다.');
    } catch (error) {
      console.error('Error checking ID:', error);
      alert('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const handleNickCheck = async () => {
    if (!form.userNick) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    const nicknameRegex = /^.{6,20}$/;
    if (!nicknameRegex.test(form.userNick)) {
      alert('닉네임은 6~20자 이내로 작성해야 합니다.');
      return;
    }
    try {
      const response = await fetch('http://localhost:4040/api/v1/auth/check-nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userNick: form.userNick })
      });

      const result = await response.json();
      console.log('Nickname Check Response:', result);

      setIsNickValid(result);
      alert(result ? '닉네임 사용 가능' : '닉네임이 이미 사용 중입니다.');
    } catch (error) {
      console.error('Error checking nickname:', error);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEmailCertification = async () => {
    if (!form.userEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4040/api/v1/auth/email-certification', {
        email: form.userEmail
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.code === 'SU') {
        sessionStorage.setItem('email', form.userEmail);
        setModalIsOpen(true); // 모달 열기
      } else {
        alert('이메일 인증 요청에 실패하였습니다: ' + (response.data.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('Error during email certification request:', error);
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    if (form.userPassword !== form.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isPasswordValid) {
      alert('비밀번호가 조건을 만족하지 않습니다.');
      return;
    }

    if (isIdValid === false) {
      alert('아이디가 이미 사용 중입니다.');
      return;
    }

    if (isIdValid === null) {
      alert('아이디 체크를 해주세요.');
      return;
    }

    if (isNickValid === false) {
      alert('닉네임이 이미 사용 중입니다.');
      return;
    }

    if (isNickValid === null) {
      alert('닉네임 체크를 해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4040/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: form.userName,
          userId: form.userId,
          userEmail: form.userEmail,
          userPassword: form.userPassword,
          userNick: form.userNick
        })
      });

      const result = await response.json();
      console.log('Sign-up Response:', result);

      if (result.code === 'SU') {
        alert('회원가입에 성공했습니다!');
        navigate('/'); // 메인 페이지로 리디렉션
      } else {
        alert(`회원가입에 실패했습니다: ${result.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
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
            <input type="text" id="userName" name="userName" placeholder="이름을 입력해주세요" required onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor="userId">*아이디</label>
            <input type="text" id="userId" name="userId" placeholder="아이디를 입력해주세요" required onChange={handleChange} />
            <button type="button" onClick={handleIdCheck}>아이디 체크</button>
          </div>
          <div className='form-group'>
            <label htmlFor="userEmail">*이메일</label>
            <input type="email" id="userEmail" name="userEmail" placeholder="example@a.com" required onChange={handleChange} />
            <button type="button" onClick={handleEmailCertification}>인증</button>
          </div>
          <div className='form-group'>
            <label htmlFor="userPassword">*비밀번호</label>
            <input type="password" id="userPassword" name="userPassword" placeholder="영문, 숫자, 특수문자 조합으로 8~20자 이내" required onChange={handleChange} />
            {isPasswordValid === true && <span className="valid-feedback">조건 만족</span>}
            {isPasswordValid === false && <span className="invalid-feedback">조건 불만족</span>}
          </div>
          <div className='form-group'>
            <label htmlFor="passwordConfirm">*비밀번호 확인</label>
            <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="사용하실 비밀 번호를 입력해주세요" required onChange={handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor="userNick">*닉네임</label>
            <input type="text" id="userNick" name="userNick" placeholder="6~20자 이내의 닉네임" required onChange={handleChange} />
            <button type="button" onClick={handleNickCheck}>닉네임 체크</button>
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Email Certification Modal"
        className="certification-modal"
        overlayClassName="certification-overlay"
      >
        <Certification closeModal={() => setModalIsOpen(false)} setIsEmailVerified={setIsEmailVerified} />
      </Modal>
    </div>
  );
}

export default Register;
