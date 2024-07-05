import React from 'react';
import MyPlace from '../specific/MyPlace';
import TotalRoute from '../specific/TotalRoute';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Weather from '../specific/Weather';

function CreateMyCourse() {
    return (
        <div>
            <Navbar />
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
