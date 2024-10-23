import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function OAuthLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies, setCookie] = useCookies();
    const [userId, setUserId] = useState('');
    
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = `${DOMAIN}/api/v1`;
    
    // URL에서 쿼리 파라미터를 가져오는 함수
    const getPathParams = () => {
        const pathParts = location.pathname.split('/');
        return {
            token: pathParts[3],
            expirationTime: pathParts[4]
        };
    };

    useEffect(() => {
        const { token, expirationTime } = getPathParams();  // 경로에서 token과 expirationTime 추출
    
        if (!token) return;
    
        axios.get(`${API_DOMAIN}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res) {
            setUserId(res.data.id); 
            
            const now = new Date().getTime();
            const expires = new Date(now + Number(expirationTime) * 1000); 
            
            setCookie('accessToken', token, { expires, path: '/', secure: true });
            localStorage.setItem('token', token);
            localStorage.setItem('userId', res.data.id); 
            localStorage.setItem('userRole', 'ROLE_USER');
    
            navigate('/', { replace: true });  // 로그인 후 메인 페이지로 이동
    
        })
        .catch(function(error) {
            console.error("There was an error fetching user data!", error);
            navigate('/logindetail', { replace: true });  // 오류 시 로그인 페이지로 리디렉션
        });
    }, [API_DOMAIN, navigate]);

    return <div>OAuth Login in progress...</div>;
}
