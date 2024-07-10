import React, { useState, useRef, useEffect } from 'react';
import "../../assets/styles/CreateMyCourse.css";
import axios from 'axios';
import Car from '../../assets/images/Car.png';
import LeftArrow from '../../assets/images/MainLeftArrow.png';
import RightArrow from '../../assets/images/MainRightArrow.png';

const CreateMyCourse = ({token}) => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [durations, setDurations] = useState([]); 
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const lineRef = useRef(null);
    const markersRef = useRef([]);
    const imageListRef = useRef(null); 
    const [userId, setUserId] = useState(null);

    useEffect (() => {
        axios.get('http://localhost:4040/api/v1/user', {
            headers: {
                'Authorization': `Bearer ${token}` // 요청 헤더에 토큰 추가
            }
        })
        .then(function(res){
            console.log('User data:', res.data.id);
            setUserId(res.data.id);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }, [token]);

    // 카테고리별 찜 리스트
    const category = (value) => {
        if (!value) {
            console.error("카테고리 값이 없습니다.");
            return;
        }

        axios.post('http://localhost:4040/api/v1/getmycourse/getplacecat', {
            placeCat: value
        })
        .then(response => {
            console.log(response.data);
            setImages(response.data);  // 전체 이미지 객체 배열을 저장
        })
        .catch(error => {
            console.error('오류가 발생했습니다!', error);
        });
    }

    // 이미지 선택
    const selectImage = (image) => {
        if (selectedImages.length < 4) {
            const saveSelectedImages = [...selectedImages, image];
            setSelectedImages(saveSelectedImages);

            if (saveSelectedImages.length === 4) {    //이미지 4개 모두 선택 시 경로 출력
                handleSave(saveSelectedImages);
            }
        } else {
            alert("4개까지만 선택할 수 있습니다.");
        }
    }

    // 취소
    const clearSelectedImages = () => {
        setSelectedImages([]);
        setDurations([]);  // 추가: 소요시간 초기화
        // 맵과 선, 마커 초기화
        if (lineRef.current) {
            lineRef.current.setMap(null);
        }
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (mapRef.current) {
            mapRef.current.setCenter(new window.naver.maps.LatLng(37.5665, 126.9780));
            mapRef.current.setZoom(8);
        }
    }

    // 맵 초기화
    useEffect(() => {
        const initMap = () => {
            const { naver } = window;
            const initialLocation = new naver.maps.LatLng(37.5665, 126.9780);
            const options = {
                center: initialLocation,
                zoom: 8,
            };
            const map = new naver.maps.Map(mapContainer.current, options);
            mapRef.current = map;
        };

        // 서버에서 네이버 맵 스크립트 가져오기
        axios.get('http://localhost:4040/api/v1/getmap')
            .then(response => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = response.data;
                script.onload = initMap; // 스크립트 로드가 완료되면 맵 초기화
                document.head.appendChild(script);
            })
            .catch(error => console.error('Error fetching map script:', error));
    }, []);

    // 이미지 4개 선택 시 맵 업데이트
    const handleSave = (saveSelectedImages) => {
        const imagesToUse = saveSelectedImages || selectedImages;
        if (imagesToUse.length === 4 && window.naver) {
            const { naver } = window;
            const coordinates = imagesToUse.map(image => new naver.maps.LatLng(image.mapy, image.mapx));
            console.log('좌표:', coordinates);  // 디버깅을 위한 좌표 출력

            if (!coordinates || coordinates.length < 2) {
                alert("좌표가 유효하지 않습니다. 최소 두 개의 좌표가 필요합니다.");
                return;
            }

            // 기존 선 제거
            if (lineRef.current) {
                lineRef.current.setMap(null);
            }

            // 기존 마커 제거
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // 선 그리기
            const polyline = new naver.maps.Polyline({
                map: mapRef.current,
                path: coordinates,
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 3
            });
            lineRef.current = polyline;

            // 마커 추가
            coordinates.forEach((coord, index) => {
                const marker = new naver.maps.Marker({
                    position: coord,
                    map: mapRef.current,
                    title: `Location ${index + 1}`
                });
                markersRef.current.push(marker);
            });

            const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new naver.maps.LatLngBounds());

            mapRef.current.fitBounds(bounds);
        } else {
            alert('네이버 맵이 로드되지 않았거나 선택된 이미지가 4개가 아닙니다.');
        }
    };

    // 경로 소요시간 계산 및 저장
    const calculateDurations = () => {
        const durationPromises = [];
        for (let i = 0; i < selectedImages.length - 1; i++) {
            const start = selectedImages[i];
            const end = selectedImages[i + 1];
            durationPromises.push(
                axios.post('http://localhost:4040/api/v1/getdrive', {
                    startLat: start.mapy,
                    startLng: start.mapx,
                    endLat: end.mapy,
                    endLng: end.mapx
                }).then(response => {
                    const data = response.data;
                   
                    if (data.route && data.route.traoptimal && data.route.traoptimal[0]) {
                        const duration = data.route.traoptimal[0].summary.duration;
                        return formatDuration(duration);  
                    }
                    return 'N/A';
                })
            );
        }
        Promise.all(durationPromises)
            .then(durations => {
                setDurations(durations);
            })
            .catch(error => console.error('Error fetching durations:', error));
    }

    // 소요시간을 읽기 쉽게 변환하는 함수 추가
    const formatDuration = (milliseconds) => {
        const totalMinutes = Math.floor(milliseconds / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours}시간 ${minutes}분`;
        } else {
            return `${minutes}분`;
        }
    }

    useEffect(() => {
        if (selectedImages.length === 4) {
            calculateDurations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImages]);

    // 이미지 리스트를 왼쪽으로 스크롤
    const scrollLeft = () => {
        if (imageListRef.current) {
            imageListRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }

    // 이미지 리스트를 오른쪽으로 스크롤
    const scrollRight = () => {
        if (imageListRef.current) {
            imageListRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }

    // 코스 저장
    const saveSelectedImages = () => {
        if (selectedImages.length !== 4) {
            alert("4개의 이미지를 선택해야 합니다.");
            return;
        }
    
        const courseData = selectedImages.map((image, index) => ({
            placeNo: image.placeNo,  // 선택한 이미지의 placeNo
            orderNo: index + 1,       // 각 이미지의 인덱스 번호 (1부터 시작)
        }));
    
        // 디버깅: courseData 콘솔 출력
        console.log('Course Data:', courseData);
    
        axios.post('http://localhost:4040/api/v1/getmycourse/getcourse', {
            userId: userId,  
            courseData: courseData
        })
            .then(response => {
                console.log(response.data);
                alert('코스가 저장되었습니다.');
            })
            .catch(error => {
                console.error('오류가 발생했습니다!', error);
                alert('코스 저장에 실패했습니다.');
            });
    }
    

    return (
        <div className="CreateMyCourseContainer">
        <div className="CreateMyCourseMyPlaceList">
            <h2>찜 리스트</h2>
        </div>

        <div className="CreateMyCourseCategory">
            <button onClick={() => category('activity')} className="button">액티비티</button>
            <button onClick={() => category('restaurant')} className="button">식당</button>
            <button onClick={() => category('cafe')} className="button">카페</button>
            <button onClick={() => category('tour')} className="button">관광지</button>
            <button onClick={() => category('accommodation')} className="button">숙박</button>
        </div>

        <div className="CreateMyCourseImageList">
            <div className="Slide">
                <img src={LeftArrow} alt="Left Arrow" className="LeftArrow" onClick={scrollLeft} />
            </div>
            {images.map((image, index) => (
                <div key={index} className="image-container">
                    <img 
                        src={image.firstImage2} 
                        alt={image.placeTitle} 
                        onClick={() => selectImage(image)} 
                        className="selectable-image"
                    />
                    <div className="image-title">{image.placeTitle}</div>
                </div>
            ))}
            <div className="Slide">
                <img src={RightArrow} alt="Right Arrow" className="RightArrow" onClick={scrollRight} />
            </div>
        </div>

        <div className="CreateMyCourseTourCombination">
            <h2>관광지 조합</h2>
            <div className="CreateMyCourseTourCombinationList">
                {selectedImages.map((image, index) => (
                    <div className="CreateMyCourseTourItem" key={index}>
                        <img src={image.firstImage2} alt={image.placeTitle} />
                        <div className="image-title">{image.placeTitle}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="TotalRoute">
            <h2>경로 총정리</h2>
        </div>
      
        <div className='map-container'>
            <div ref={mapContainer} className="map"></div>
            <div className="Course">
                {selectedImages.map((image, index) => (
                    <div key={index}>
                        <div className="CourseItem">
                            <div className="CourseIndex">{index + 1}</div>
                            <div className="CourseTitle">{image.placeTitle}</div>
                        </div>
                        {index < selectedImages.length - 1 && ( // 마지막 인덱스가 아니면 duration을 렌더링
                            <div className="duration"><img src={Car} alt="Car"/>{durations[index]}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className='CreateMyCourseConfirm'>
            <button onClick={saveSelectedImages}>저장</button>
            <button onClick={clearSelectedImages}>취소</button>
        </div>

        <div className="CreateMyCourse">
            <div className='Weather'>
                <h2>날씨 전망</h2>
            </div>
        </div> 
    </div>
    );
}

export default CreateMyCourse;
