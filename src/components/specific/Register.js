import React, { useState } from 'react';
import '../../assets/styles/Register.css';
import image from '../../assets/images/MainLogo.png';

function Register() {
  const [isIdValid, setIsIdValid] = useState(null);
  const [isNickValid, setIsNickValid] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [form, setForm] = useState({
    userName: '',
    userId: '',
    userEmail: '',
    userPassword: '',
    passwordConfirm: '',
    userNick: ''
  });

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
      setIsIdValid(result);
      console.log(result);
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
      setIsNickValid(result);
      console.log(result);
      alert(result ? '닉네임 사용 가능' : '닉네임이 이미 사용 중입니다.');
    } catch (error) {
      console.error('Error checking nickname:', error);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (isNickValid === false) {
      alert('닉네임이 이미 사용 중입니다.');
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
      if (result.success) {
        alert('회원가입에 성공했습니다!');
        window.location.href = '/';
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('회원가입에 실패했습니다.');
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
            {/* {isIdValid === true && <span className="valid-feedback">사용 가능</span>}
            {isIdValid === false && <span className="invalid-feedback">사용 불가능</span>} */}
          </div>
          <div className='form-group'>
            <label htmlFor="userEmail">*이메일</label>
            <input type="email" id="userEmail" name="userEmail" placeholder="example@a.com" required onChange={handleChange} />
            <button type="button">인증</button>
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
            {/* {isNickValid === true && <span className="valid-feedback">사용 가능</span>}
            {isNickValid === false && <span className="invalid-feedback">사용 불가능</span>} */}
          </div>
          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

