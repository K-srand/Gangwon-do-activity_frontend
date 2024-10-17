import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../../assets/styles/MainPlaceModal.css'; 
import axios from "axios";
import defaultImage from '../../assets/images/Icon_No_Image.png';
import favorite from '../../assets/images/Favorite.png';

function MainPlaceModal({ token, closeModal, selectedPlaceInfo }) {
    const mapContainer = useRef(null);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [items, setItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1';

    // 로그인 여부 확인
    useEffect(() => {
      axios.get(API_DOMAIN + '/user', {
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

    // selectedCourseInfo로부터 위치 정보 추출
    useEffect(() => {
      console.log(selectedPlaceInfo); 
      category("activity");
    }, [selectedPlaceInfo]);

    useEffect(() => {
      const loadNaverMapScript = async () => {
        if (!window.naver) {
          try {
            const response = await axios.get(API_DOMAIN + '/getmap');
            console.log("Naver map script URL:", response.data);  // 스크립트 URL 확인
            
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = response.data;
            script.onload = () => {
              console.log('Naver map script loaded successfully.');
              setMapInitialized(true);
            };
            document.head.appendChild(script);
          } catch (error) {
            console.error('Error fetching map script:', error);
          }
        } else {
          console.log('Naver map script already loaded.');
          setMapInitialized(true);
        }
      };
  
      loadNaverMapScript();
  }, []);
  

  const initializeMap = useCallback(() => {
    if (items.length > 0 && window.naver && mapInitialized) {
      const { naver } = window;
  
      // LatLngBounds 객체 생성
      const bounds = new naver.maps.LatLngBounds();
  
      // 마커 추가 및 LatLngBounds 업데이트
      items.forEach(location => {
        const markerPosition = new naver.maps.LatLng(location.mapy, location.mapx);
        const marker = new naver.maps.Marker({
          position: markerPosition,
          title: location.placeTitle
        });
  
        // 마커의 좌표를 bounds에 추가하여 영역을 확장
        bounds.extend(markerPosition);
      });
  
      // 지도 초기화
      const map = new naver.maps.Map(mapContainer.current, {
        zoom: 8,
      });
  
      // 마커들을 지도에 추가
      items.forEach(location => {
        const markerPosition = new naver.maps.LatLng(location.mapy, location.mapx);
        new naver.maps.Marker({
          position: markerPosition,
          map,
          title: location.placeTitle,
        });
      });
  
      // 지도 중심을 bounds의 중심으로 설정하고, 마커들이 모두 보이도록 zoom을 조정
      map.fitBounds(bounds);
  
      // 강원도 행정구역 데이터 레이어 호출
      axios.get(DOMAIN + '/resources/json/gangwondo.json')
        .then(response => {
          const geojson = response.data;
          map.data.addGeoJson(geojson);
          map.data.setStyle({
            fillColor: '#FFAF00',
            fillOpacity: 0.4,
            strokeColor: '#FFAF00',
            strokeWeight: 2,
          });
        })
        .catch(error => console.error('Error fetching GeoJSON:', error));
    }
  }, [items, mapInitialized]);
  
  
      
    useEffect(() => {
    if (mapInitialized) {
        initializeMap();
    }
    }, [mapInitialized, initializeMap]);

    // 카테고리별 추천 장소 출력
    const category = (value) => {
        axios.post(API_DOMAIN + '/getjson/getplacecat', {
            placeCat: value
        })
        .then(response => {
            console.log('Category Data:', response.data);
            const fetchedItems = response.data.map(place => ({
                id: place.placeNo,
                img: place.firstImage,
                title: place.placeTitle,
                mapx: place.mapx,
                mapy: place.mapy
            }));
            setItems(fetchedItems);
        })
        .catch(error => console.error('Error fetching category places:', error));
    };

    // 찜 버튼
  const favoriteplace = (item) => {
    if (userId) {
      axios.post(API_DOMAIN + '/getmyfavorite', {
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

    return (
        <div className="placemodal">
            <div className="place-modal-content">
                <h2>플레이스 모달창</h2>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button className="btn btn-primary" onClick={() => category('activity')}>액티비티</button>
                    <button type="button" className="btn btn-primary" onClick={() => category('restaurant')}>식당</button>
                    <button type="button" className="btn btn-primary" onClick={() => category('cafe')}>카페</button>
                    <button type="button" className="btn btn-primary" onClick={() => category('tour')}>관광지</button>
                    <button type="button" className="btn btn-primary" onClick={() => category('accommodation')}>숙박</button>
                  </div>
                <div className="place-modal-actions">
                    <button onClick={closeModal}>X</button>
                </div>

                <div className="place-modal-map-containers">
                    <div ref={mapContainer} className="place-modal-map"></div>
                </div>

                <div className="recommendPlaceModal"> 
                  <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators carousel-indicator-modal">
                      {items.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          data-bs-target="#carouselExampleIndicators"
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-current={index === 0 ? "true" : "false"}
                          aria-label={`Slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                    
                    <div className="carousel-inner">
                      {items.map((item, index) => (
                        <div key={item.id} className={`carousel-item ${index === 0 ? "active" : ""} card card-modal`}>
                          <div className="image-grid-item">
                            <img src={item.img || defaultImage} className="d-block card-img-top card-img-top-modal" alt={item.title}/>
                            <img className="favoriteplace" src={favorite} alt="favorite" onClick={() => favoriteplace(item)} />
                            
                              <h5 className="card-title card-title-modal">{item.title}</h5>
                              <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                              </div>
                          
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="carousel-control-prev carousel-control-prev-modal" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next carousel-control-next-modal" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
            </div>
        </div>
    );
}

export default MainPlaceModal;
