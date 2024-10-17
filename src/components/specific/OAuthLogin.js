import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function OAuthLogin() {
    const [userId, setUserId] = useState('');
    const { token, expirationTime } = useParams();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1';

    // 사용자 데이터를 가져오는 useEffect
    useEffect(() => {
        if (!token) return;

        axios.get(API_DOMAIN + '/user', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(function(res) {
            console.log('User data:', res.data.id);
            setUserId(res.data.id);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }, [token]);

    // 토큰 및 userId 저장 로직
    useEffect(() => {
        if (!token || !expirationTime || !userId) return;

        const now = new Date().getTime(); 
        const expires = new Date(now + Number(expirationTime) * 1000); 

        setCookie('accessToken', token, { expires, path: '/' });
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId); 
        localStorage.setItem('userRole', 'ROLE_USER');

        console.log('Logged in successfully');

        navigate('/'); 
        window.location.reload(); 
    }, [token, expirationTime, userId]);

    return <div>OAuth Login in progress...</div>;
}
