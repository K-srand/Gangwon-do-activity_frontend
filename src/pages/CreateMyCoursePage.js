import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateMyCourse from '../components/specific/CreateMyCourse.js';
import WeatherPage from './WeatherPage.js';
import Footer from '../components/common/Footer.js';

function CreateMyCoursePage() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            alert("로그인 후 이용가능합니다!");
            navigate('/loginDetail'); // 로그인 페이지 경로로 리디렉션
        } 
    }, [token, navigate]);

    return (
        <div>
            <main>
                <CreateMyCourse token={token} />
                <WeatherPage />
            </main>
            <Footer/>
        </div>
    );
}

export default CreateMyCoursePage;
