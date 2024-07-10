import React from 'react';
import MyPlace from '../components/specific/MyPlace';
import TotalRoute from '../components/specific/TotalRoute';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import Weather from '../components/specific/Weather';

function CreateMyCourse() {
    return (
        <div>
            {/* <Navbar /> */}
            <main>
                <MyPlace />
                <TotalRoute />
                <Weather />
            </main>
            <Footer />
        </div>
    );
}

export default CreateMyCourse;
