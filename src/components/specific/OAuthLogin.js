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
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            token: params.get('token'),
            expirationTime: params.get('expirationTime')
        };
    };

    // 사용자 정보를 가져오는 useEffect
    useEffect(() => {
        const { token, expirationTime } = getQueryParams();

        console.log('token: ', token);
        console.log('expirationTime: ', expirationTime);

        if (!token) return;

        // axios.get(`${API_DOMAIN}/user`, {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // })
        // .then(function(res) {
        //     console.log('User data:', res.data.id);
        //     setUserId(res.data.id); 
            
        //     const now = new Date().getTime();
        //     const expires = new Date(now + Number(expirationTime) * 1000); 
            
        //     setCookie('accessToken', token, { expires, path: '/', secure: true });
        //     localStorage.setItem('token', token);
        //     localStorage.setItem('userId', res.data.id); 
        //     localStorage.setItem('userRole', 'ROLE_USER');

        //     console.log('Logged in successfully');

        //     navigate('/', { replace: true });  

        // })
        // .catch(function(error) {
        //     console.error("There was an error fetching user data!", error);
        //     navigate('/login', { replace: true });
        // });

        // window.location.reload();
    }, [API_DOMAIN]);

    return <div>OAuth Login in progress...</div>;
}
