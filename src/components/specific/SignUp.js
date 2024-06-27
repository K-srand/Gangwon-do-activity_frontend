import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../assets/styles/signup.css';

function Signup() {
    return (<form name="join" method="post" action="">
    <div className="signup-container">
        <div className="logo">
             <h1>강원액티비 로고</h1>
        </div>
        <div className="tagline">
            <h2>Welcome 강추!</h2>
            <p>위치 API 기반 강원도 액티비티 추천 웹사이트</p>
        </div>
        <div className="signup-button-container">
        
        <div class="input-container">
            <label class="input-label">*이름</label>
            <input type="text" class="custom-input" placeholder="이름을 입력해주세요"></input>
        </div>
        <div class="input-container">
            <label class="input-label">*아이디</label>
            <input type="text" class="custom-input" placeholder="아이디를 입력해주세요" name="userid"></input>
            <button type="button" class="custom-button" onclick="idcheck">중복확인</button>
        </div>
        <div class="input-container">
            <label class="input-label">*이메일</label>
            <input type="email" class="custom-input" placeholder="example@gangchu.com" name="userid"></input>
            <button type="button" class="custom-button" onclick="emailcheck">인증</button>
        </div>
        <div class="input-container">
            <label class="input-label">*비밀번호</label>
            <input type="password" class="custom-input" placeholder="비밀번호를 입력해주세요" name="userid"></input>
        </div>
        <div class="input-container">
            <label class="input-label">*비밀번호 확인</label>
            <input type="password" class="custom-input" placeholder="비밀번호를 입력해주세요" name="userid"></input>
        </div>
        <div class="input-container">
            <label class="input-label">*닉네임</label>
            <input type="text" class="custom-input" placeholder="닉네임을 입력해주세요" name="userid"></input>
            <button type="button" class="custom-button">중복확인</button>
        </div>
        <button type="submit" class="custom-button" onclick="sign">가입하기</button>
        </div>
        <div className="link-container">
        
        </div>
    </div></form>
    );
  }
  
  export default Signup;