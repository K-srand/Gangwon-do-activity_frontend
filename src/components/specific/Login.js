import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../assets/styles/login.css';

function login() {
    return (
    <div className="login-container">
      < div className="logo">
        <h1>강원액티비 로고</h1>
      </div>
      <div className="tagline">
        <h2>강추와 함께하는 강원도 여행!</h2>
      </div>
      <div className="login-button-container">
        <button className="login-button">로그인하기</button>
      </div>
      <div className="link-container">
      `  <LinkContainer to="/SignUp">
                <Nav.Link>회원가입</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/SignUp">
                <Nav.Link>아이디찾기</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/SignUp">
                <Nav.Link>비밀번호 찾기</Nav.Link>
        </LinkContainer>`
      </div>
    </div>
    );
  }
  
  export default login;