import React from "react";
import logo from '../../assets/images/MainLogo.png';
import '../../assets/styles/Login.css';

const Login = () => {
    return (
        <div className="log-modal-main">
            <div className="log-modal-main-logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="content-textbox">
                <div className="content">강추와 함께하는 강원도 여행!</div>
            </div>
            <div className="login-container">
                <a href="/logindetail" className="button-link">로그인하기</a>
                <div className="login-options">
                    <a href="/register" className="nav">회원가입</a>
                    <a href="/findid" className="nav">아이디 찾기</a>
                    <a href="/findpassword" className="nav">비밀번호 찾기</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
