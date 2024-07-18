import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/LoginDetail.css';
import logo from '../../assets/images/MainLogo.png';

const LoginDetail = () => {
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId'); // userId도 함께 확인

        if (token && storedUserId) {
          navigate('/');
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4040/api/v1/auth/sign-in', {
            userId: userId,
            userPassword: userPassword
        })
        .then(function(res){
            const token = res.data.token; // 서버에서 반환된 JWT 토큰
            const userIdFromResponse = res.data.userId; // 서버에서 반환된 사용자 ID
            localStorage.setItem('token', token); // 토큰 저장
            localStorage.setItem('userId', userIdFromResponse); // 사용자 ID 저장
            console.log('Logged in successfully:', res);
            navigate('/'); // 메인페이지로 리다이렉트
            window.location.reload();
        })
        .catch(function(error) {
            alert("로그인 정보가 틀렸습니다"); 
            console.error("There was an error!", error);
        });
    }

    return (
        <div>
            <div className='login-modal-main'>
                
                <div className='login-modal-main-logo'>
                    <img src={logo} alt="Logo"></img>
                </div>
                <div className='login-modal-main-login-textbox'>
                    <div className='bold'>강추 로그인</div>
                    <div className='detail'>로그인 정보를 입력하세요</div>
                </div>

                <div className='login-modal-main-login-inputboxes'>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="userId">*아이디</label>
                        <input 
                            type="text" 
                            id="userId" 
                            name="userId" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)}  
                        />

                        <label htmlFor="userPassword">*비밀번호</label>
                        <input 
                            type="password" 
                            id="userPassword" 
                            name="userPassword" 
                            value={userPassword} 
                            onChange={(e) => setUserPassword(e.target.value)} 
                        />

                        <div className='login-modal-main-login-accept'>
                            <button type="submit">로그인</button>
                        </div>
                    </form>
                </div>

                <div className='login-modal-main-find'>
                    <div className="links">
                        <a href="/findid">아이디 찾기 </a>
                        <a href="/findpassword">비밀번호 찾기</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginDetail;
