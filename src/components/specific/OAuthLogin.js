import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function OAuthLogin() {
    const [userId, setUserId] = useState('');
    const { token, expirationTime } = useParams(); // URL에서 token과 expirationTime을 가져옴
    const [cookies, setCookie] = useCookies();
    const navigate = useNavigate();
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1';

    // 사용자 데이터를 가져오는 useEffect
    useEffect(() => {
        if (!token) return;  // token이 없으면 실행하지 않음

        // 사용자 데이터 가져오기
        axios.get(`${API_DOMAIN}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`  // Bearer 토큰 방식으로 요청
            }
        })
        .then(function(res) {
            console.log('User data:', res.data.id);
            setUserId(res.data.id);  // 사용자 ID 설정
        })
        .catch(function(error) {
            console.error("There was an error fetching user data!", error);
            // 오류가 발생할 경우, 에러 페이지 또는 로그인 페이지로 리디렉션 처리할 수 있음
            navigate('/login', { replace: true });
        });
    }, [token, API_DOMAIN, navigate]);

    // 토큰 및 userId 저장 로직
    useEffect(() => {
        // 모든 값이 존재할 때만 실행
        if (!token || !expirationTime || !userId) return;

        const now = new Date().getTime();
        const expires = new Date(now + Number(expirationTime) * 1000); // 만료 시간 계산

        // 쿠키와 로컬 스토리지에 저장
        setCookie('accessToken', token, { expires, path: '/', secure: true });

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); 
        localStorage.setItem('userRole', 'ROLE_USER');

        console.log('Logged in successfully');

        // 메인 페이지로 이동
        navigate('/', { replace: true });  // replace: true로 새로고침 방지
    }, [token, expirationTime, userId, setCookie, navigate]);

    return <div>OAuth Login in progress...</div>;
}
