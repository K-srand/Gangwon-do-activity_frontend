import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from "axios";
import '../../assets/styles/MainPage.css';
import leftArrow from '../../assets/images/MainLeftArrow.png';
import rightArrow from '../../assets/images/MainRightArrow.png';
import favorite from '../../assets/images/Favorite.png';
import defaultImage from '../../assets/images/Icon_No_Image.png';
import main from '../../assets/images/main.png';

function MainUpper({ token }) {
  const mapContainer = useRef(null);
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userId, setUserId] = useState(null);
  //사용자 추천 코스
  const [myCourseNo, setMyCourseNo] = useState(null);
  const [myCourse, setMyCourse] = useState([]);
  const [userNick, setUserNick] = useState([]);
  const [boardNo, setBoardNo] = useState([]);

  // 로그인 여부 확인
  useEffect(() => {
    axios.get('https://gangwonactivity.site/api/v1/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(function (res) {
        console.log('User data:', res.data.id);
        setUserId(res.data.id);
      })
      .catch(function (error) {
        console.error("There was an error!", error);
      });
  }, [token]);

  useEffect(() => {
    // 추천 10개 액티비티 호출
    axios.get('https://gangwonactivity.site/api/v1/getjson/getplace')
      .then(response => {
        console.log('Fetched Data:', response.data);
        setLocations(response.data);
        const fetchedItems = response.data.map(place => ({
          id: place.placeNo,
          img: place.firstImage,
          title: place.placeTitle,
        }));
        setItems(fetchedItems);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  // 네이버 맵 API 호출
  useEffect(() => {
    const loadNaverMapScript = async () => {
      if (!window.naver) {
        try {
          const response = await axios.get('https://gangwonactivity.site/api/v1/getmap');
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = response.data;
          script.onload = () => setMapInitialized(true);
          document.head.appendChild(script);
        } catch (error) {
          console.error('Error fetching map script:', error);
        }
      } else {
        setMapInitialized(true);
      }
    };

    loadNaverMapScript();
  }, []);

  // 마커 표시&맵 초기화
  const initializeMap = useCallback(() => {
    if (locations.length > 0 && window.naver && mapInitialized) {
      const { naver } = window;

      const initialLocation = new naver.maps.LatLng(37.8304115, 128.2260705);
      const options = {
        center: initialLocation,
        zoom: 8,
      };
      const map = new naver.maps.Map(mapContainer.current, options);

      locations.forEach(location => {
        const markerPosition = new naver.maps.LatLng(location.mapy, location.mapx);
        const marker = new naver.maps.Marker({
          position: markerPosition,
          map,
          title: location.placeTitle
        });

        // 플레이스 타이틀 호출
        naver.maps.Event.addListener(marker, 'click', () => {
          axios.post('https://gangwonactivity.site/api/v1/getjson/getplacetitle', {
            placeTitle: location.placeTitle,
            placeMapx: location.mapx,
            placeMapy: location.mapy
          })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error('There was an error!', error);
            });
        });
      });

      // 강원도 행정구역 데이터 레이어 호출
      axios.get('https://gangwonactivity.site/resources/json/gangwondo.json')
        .then(response => {
          const geojson = response.data;
          map.data.addGeoJson(geojson);
          map.data.setStyle({
            fillColor: '#FFAF00',
            fillOpacity: 0.4,
            strokeColor: '#FFAF00',
            strokeWeight: 2
          });
        })
        .catch(error => console.error('Error fetching GeoJSON:', error));
    }
  }, [locations, mapInitialized]);

  useEffect(() => {
    if (mapInitialized) {
      initializeMap();
    }
  }, [mapInitialized, initializeMap]);

  // 선택한 위치 중심으로 카테고리별 추천 장소 출력
  const category = (value) => {
    axios.post('https://gangwonactivity.site/api/v1/getjson/getplacecat', {
      placeCat: value
    })
      .then(response => {
        console.log('Category Data:', response.data);
        const fetchedItems = response.data.map(place => ({
          id: place.placeNo,
          img: place.firstImage,
          title: place.placeTitle,
        }));
        setItems(fetchedItems);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  // 장소 리스트 슬라이드
  const nextItems = () => {
    if (currentIndex + 4 < items.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const prevItems = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  // 찜 버튼
  const favoriteplace = (item) => {
    if (userId) {
      axios.post('https://gangwonactivity.site/api/v1/getmyfavorite', {
        placeNo: item.id,
        userId: userId
      })
        .then(response => {
          if (response.data.code === 'FE') {
            alert("이미 찜한 장소입니다!");
          } else if (response.data.code === 'SU') {
            alert("성공적으로 찜하였습니다!");
          }
        })
        .catch(error => {
          const responseData = error.response.data;
          if (responseData.code === 'FE') {
            alert("이미 찜한 장소입니다!");
          }
          console.error("찜 처리 중 오류가 발생했습니다:", error);
        });
    } else {
      alert("로그인 후 이용가능합니다!");
    }
  };

  
  //사용자 추천 코스
  // 첫 번째 요청을 보내는 비동기 함수를 정의합니다.
  const fetchFirstData = async () => {
      try {
          const firstResponse = await axios.post('https://gangwonactivity.site/api/v1/recommend', {});
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
              const secondResponse = await axios.get(`https://gangwonactivity.site/api/v1/recommend/${courseNo}`);
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
  
  const recommend = () => {
      window.location.href = `/recommend`;
  }


  return (
    <div className='mainupper'>
      <div className='main-image'>
      <img className='main' src={main} alt="main" />
      <h2 className='gangchu'>강원도 액티비티 사이트 강추!</h2>
      </div>
      <div className='recommendplace'>
        <h2>강추에서 추천하는 장소!</h2>
      </div>
      {/* 맵 api */}
      <div className="map-containers">
        <div ref={mapContainer} className="map"></div>
        <div className="button-container">
          <button onClick={() => category('activity')} className="button">액티비티</button>
          <button onClick={() => category('restaurant')} className="button">식당</button>
          <button onClick={() => category('cafe')} className="button">카페</button>
          <button onClick={() => category('tour')} className="button">관광지</button>
          <button onClick={() => category('accommodation')} className="button">숙박</button>
        </div>
      </div>

      {/* 장소 리스트 */}
      <div className="main-cards-container">
        <div className="mainpage-carousel-container">
          <button className={`prev-button ${currentIndex === 0 ? 'hidden' : ''}`} onClick={prevItems}>
            <img src={leftArrow} alt="Previous" />
          </button>

          <div className="carousel">
            {items.slice(currentIndex, currentIndex + 4).map((item) => (
              <div key={item.id} className="mainpage-carousel-item">
                <div className="image-container">
                  <img className="place" src={item.img || defaultImage} alt={item.title} onError={(e) => e.target.style.display = 'none'} />
                  <img className="favoriteplace" src={favorite} alt="favorite" onClick={() => favoriteplace(item)} />
                </div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
          <button className={`next-button ${currentIndex + 4 >= items.length ? 'hidden' : ''}`} onClick={nextItems}>
            <img src={rightArrow} alt="Next" />
          </button>
        </div>
      </div>

      {/* 사용자 추천 코스 */}
      <div className='recommend-course'>
        <div className='recommendplace'>
          <h2>사용자 추천 코스</h2>
        </div>
          {userNick.map((nick, index) => (
              <div key={index} className='user-course'>
                  <p className='user-nickname'>{nick} 님의 추천 !</p>
                  <div className='recommend-course-options'>
                      {myCourse[index] && myCourse[index].map((course, i) => (
                          <div key={i} className='recommend-course-item'>
                              <img src={course.firstImage2 || defaultImage} alt={course.placeTitle} onClick={() => recommend()}  className='course-image' />
                              <div>{course.placeTitle}</div>
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>

      <div className='Weather'>
        <h2>날씨 전망</h2>
      </div>
    </div>
  );
}

export default MainUpper;
