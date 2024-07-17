import React, { useEffect, useState } from 'react';
import '../../assets/styles/Recommend.css';
import axios from 'axios';

function Recommend(){

    const [myCourseNo, setMyCourseNo] = useState(null);
    const [myCourse, setMyCourse] = useState([]);
    const [userNick, setUserNick] = useState([]);
    const [boardNo, setBoardNo] = useState([]);

    // 첫 번째 요청을 보내는 비동기 함수를 정의합니다.
    const fetchFirstData = async () => {
        try {
            const firstResponse = await axios.post('http://localhost:4040/api/v1/recommend', {});
            const courseNo = firstResponse.data.slice(0, 3).map(item => item.myCourseNo);
            const nickname = firstResponse.data.slice(0, 3).map(item => item.userNick);
            const noBoard = firstResponse.data.slice(0, 3).map(item => item.boardNo);
            setMyCourseNo(courseNo);
            setUserNick(nickname);
            console.log("data " , firstResponse.data);
            console.log("no", typeof(firstResponse.data[0].boardNo));
            setBoardNo(noBoard);
            console.log("!!!!!!!!!!!!!!!", courseNo);

        } catch (err) {
            console.error('첫 번째 요청 중 오류 발생:', err);
        }
    };

    // myCourseNo가 변경될 때 두 번째 요청을 보내는 비동기 함수를 정의합니다.
    const fetchSecondData = async () => {
        try {
            const allCourseDetails = [];

            for (let i = 0; i < myCourseNo.length; i++) {
                const courseNo = myCourseNo[i];
                const secondResponse = await axios.get(`http://localhost:4040/api/v1/recommend/${courseNo}`);
                const courseDetails = secondResponse.data.slice(0, 4).map(imageObj => ({
                    placeTitle: imageObj.placeTitle,
                    firstImage2: imageObj.firstImage2,
                }));

                allCourseDetails.push(courseDetails);
            }

            setMyCourse(allCourseDetails);
        } catch (err) {
            console.error('두 번째 요청 중 오류 발생:', err);
        }
    };

    useEffect(() => {
        fetchFirstData();
    }, []);

    useEffect(() => {
        fetchSecondData();
    }, [myCourseNo]);
    
    const recommendBoard = (boardNo) => {
        window.location.href = `/BoardDetail/${boardNo}`;
    }


    return (
        <div className='recommend-course'>
            {userNick.map((nick, index) => (
                <div key={index} className='user-course'>
                    <p className='user-nickname'>{nick} 님의 추천 !</p>
                    <div className='recommend-course-options'>
                        {myCourse[index] && myCourse[index].map((course, i) => (
                            <div key={i} className='recommend-course-item'>
                                <img src={course.firstImage2} alt={course.placeTitle} onClick={() => recommendBoard(boardNo[index])}  className='course-image' />
                                <div>{course.placeTitle}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}

export default Recommend;