import React from "react";
import welcome from '../../assets/images/welcome.png';
import '../../assets/styles/Introduce.css';
import favoriteslist from '../../assets/images/FavoritesList.png';
import course from '../../assets/images/Course.png';
import bestcourse from '../../assets/images/bestcourse.png';
import community from '../../assets/images/community.png';
import Ranksuper from '../../assets/images/Ranksuper.png';
import Rank5 from '../../assets/images/Rank5.png';
import Rank4 from '../../assets/images/Rank4.png';
import Rank3 from '../../assets/images/Rank3.png';
import Rank2 from '../../assets/images/Rank2.png';
import Rank1 from '../../assets/images/Rank1.png';

const Introduce = () => {
    return (
        <div className="introduce">
            <div className="welcomGangwondo">
            <img className="welcome" src={welcome}/> 
            <h2 className="welcomeText">강원도로 오세요!</h2>
            </div>
            <p>안녕하세요. 강원도 여행을 꿈꾸는 분들을 위한 최고의 웹사이트 '강추!'에 오신 것을 환영합니다.<br/>
저희 사이트는 여행자들이 서로 평점과 실제 리뷰를 공유하며, 사실적인 경험을 바탕으로 다양한 액티비티를 쉽게 접할 수 있도록 돕고 있습니다.</p>
            <h2>왜 강원도인가요?</h2>
            <p>2023년 관광 트렌드 전망 설문 조사와 데이터 종합 분석에 따르면, 강원도는 로컬 관광 의향 지역 1순위로 가장 높은 비율을 기록했습니다.<br/> 
특히, 레저 스포츠와 다양한 액티비티에 대한 수요가 급증하고 있는 지역입니다.<br/>
대표적인 여행 웹사이트인 클룩, 와그, 여기어때 등은 전국을 대상으로 하지만, 저희 사이트는 강원도에 특화된 상세한 정보를 제공합니다.<br/>
이러한 이유로, 저희 사이트는 강원도에 중점을 두고 더욱 풍부한 정보를 제공하고자 합니다.</p>
            <h2>이런 서비스는 어떠세요?</h2>
            <h3 className="save">플레이스들을 저장해 나만의 코스를 만들어보세요!</h3>

            <div className="how-about-this-service">
                <img className="favoriteslist" src={favoriteslist}/>
                <img className="course" src={course}/>
            </div>
            
            <h3 className="gangwondo-course">강추! 사용자들이 추천하는 강원도 여행 코스</h3>
            <img className="bestcourse" src={bestcourse}/>
            <h3 className="community">강추 사용자들과 커뮤니티를 통해 경험을 나누어보세요!</h3>
            <h3 className="userRole">커뮤니티 글과 댓글을 작성하면 경험치가 올라가요! <br/>대홍단 왕감자가 되어보세요!</h3>
            
            <div className="communitywagmaja">
            <img className="user-community" src={community}/>

                <div className="rank">
                <article><img src={Ranksuper}/></article>
                <article><img src={Rank5}/></article>
                <article><img src={Rank4}/></article>
                <article><img src={Rank3}/></article>
                <article><img src={Rank2}/></article>
                <article><img src={Rank1}/></article>
                </div>

            </div>

            
            <p>강추!와 함께 강원도의 매력을 만끽하세요.<br/>여러분의 멋진 강원도 여행을 응원합니다!<br/>-낌씸박이</p>
        </div>
    );
}

export default Introduce;