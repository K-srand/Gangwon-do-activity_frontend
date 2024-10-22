import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function OAuthLogin() {
    const [userId, setUserId] = useState('');
    const { token, expirationTime } = useParams(); // URL에서 token과 expirationTime을 가져옴
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1';

    // 사용자 데이터를 가져오는 useEffect
    useEffect(() => {
        if (!token) return;

        axios.get(API_DOMAIN + '/user', {
            headers: {
                'Authorization': `Bearer ${token}`  // Bearer 토큰 방식으로 요청
            }
        })
        .then(function(res) {
            console.log('User data:', res.data.id);
            setUserId(res.data.id);  // 사용자 ID 설정
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }, [token]);

    // 토큰 및 userId 저장 로직
    useEffect(() => {
        // 모든 값이 존재할 때만 실행
        if (!token || !expirationTime || !userId) return;

        const now = new Date().getTime(); 
        const expires = new Date(now + Number(expirationTime) * 1000); // 만료 시간 계산

        // 쿠키와 로컬스토리지에 저장
        setCookie('accessToken', token, { expires, path: '/', secure: true });

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); 
        localStorage.setItem('userRole', 'ROLE_USER');

        console.log('Logged in successfully');

        // 네비게이트 후 새로고침
        navigate('/'); 

    }, [token, expirationTime, userId, setCookie, navigate]);

    return <div>OAuth Login in progress...</div>;
}
