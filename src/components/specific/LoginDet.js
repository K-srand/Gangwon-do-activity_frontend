import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../assets/styles/logindet.css';

function login() {
    return (<form name="join" method="post" action="/Join">
    <div className="login-container">
      < div className="logo">
        <h1>강원액티비 로고</h1>
      </div>
      <div className="tagline">
        <h2>강추와 함께하는 강원도 여행!</h2>
      </div>
      <div className="login-button-container">
       <div class="input-container">
         <label class="input-label">*아이디</label>
       </div>
       <div class="input-container">
         <input type="text" class="custom-input" placeholder="아이디를 입력해주세요" name="userid"></input>
       </div>
       <div class="input-container">
         <label class="input-label">*비밀번호</label>     
       </div>
       <div class="input-container">
         <input type="password" class="custom-input" placeholder="비밀번호를 입력해주세요" name="userid"></input>
       </div>
       <button className="login-button" class="submit">로그인하기</button>
      </div>
      <div className="link-container">
      </div>
    </div></form>
    );
  }
  
  export default login;