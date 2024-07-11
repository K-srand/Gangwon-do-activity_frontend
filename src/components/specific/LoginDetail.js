import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/LoginDetail.css';
import logo from '../../assets/images/MainLogo.png';

const LoginDetail = () => {
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4040/api/v1/auth/sign-in', {
            userId: userId,
            userPassword: userPassword
        })
        .then(function(res){
            const token = res.data.token; // 서버에서 반환된 JWT 토큰
            localStorage.setItem('token', token); // 토큰 저장
            console.log('Logged in successfully:', res);
            navigate('/'); // 메인페이지로 리다이렉트
        })
        .catch(function(error) {
            alert("로그인 정보가 틀렸습니다"); 
            console.error("There was an error!", error);
        });
    }

    // const getUser = () => {
    //     const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    //     axios.get('http://localhost:4040/api/v1/user', {
    //         headers: {
    //             'Authorization': `Bearer ${token}` // 요청 헤더에 토큰 추가
    //         }
    //     })
    //     .then(function(res){
    //         console.log('User data:', res);
    //     })
    //     .catch(function(error) {
    //         console.error("There was an error!", error);
    //     });
    // }

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
                        <label htmlFor="username">*아이디</label>
                        <input 
                            type="text" 
                            id="userId" 
                            name="userId" 
                            value={userId} 
                            onChange={(e) => setUserId(e.target.value)}  
                        />

                        <label htmlFor="password">*비밀번호</label>
                        <input 
                            type="password" 
                            id="userPassword" 
                            name="password" 
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
                        <a href="#">아이디 찾기 </a>
                        <a href="#">비밀번호 찾기</a>
                    </div>
                </div>
                <div className=''></div>
            </div>
        </div>
    );
};

export default LoginDetail;
