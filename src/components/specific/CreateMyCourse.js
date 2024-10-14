import React, { useState, useRef, useEffect } from 'react';
import "../../assets/styles/CreateMyCourse.css";
import axios from 'axios';
import Car from '../../assets/images/Car.png';
import LeftArrow from '../../assets/images/MainLeftArrow.png';
import RightArrow from '../../assets/images/MainRightArrow.png';
import defaultImage from '../../assets/images/Icon_No_Image.png';

const CreateMyCourse = ({ token }) => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [durations, setDurations] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const lineRefs = useRef([]);
    const markersRef = useRef([]);
    const [userId, setUserId] = useState(null);
    const pathData = useRef([]);

    //로그인 확인
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

    //전체 찜 리스트 출력
    useEffect(() => {
        axios.post('https://gangwonactivity.site/api/v1/getmycourse/getplacetotal', {
            userId: userId
        })
        .then(response => {
            setImages(response.data);
            setCurrentImageIndex(0);
        })
        .catch(error => {
            console.error('오류가 발생했습니다!', error);
            alert('찜 리스트를 가져오는 데 오류가 발생했습니다.');
        });
    }, []);

    //카테고리별 찜 리스트 출력
    const category = (value) => {
        axios.post('https://gangwonactivity.site/api/v1/getmycourse/getplacecat', {
            userId: userId,
            placeCat: value
        })
        .then(response => {
            console.log(response.data);
            setImages(response.data);
            setCurrentImageIndex(0);
        })
        .catch(error => {
            console.error('오류가 발생했습니다!', error);
            alert('찜 리스트를 가져오는 데 오류가 발생했습니다.');
        });
    }

    // 이미지 선택 시 이벤트
    const selectImage = (image) => {
        // 이미 선택된 이미지인지 확인
        const isAlreadySelected = selectedImages.some((selectedImage) => selectedImage.placeNo === image.placeNo);

        if (isAlreadySelected) {
            alert("이미 선택된 장소입니다.");
            return; // 이미 선택된 이미지인 경우 아무 동작도 하지 않음
        }

        if (selectedImages.length < 4) {
            const saveSelectedImages = [...selectedImages, image];
            setSelectedImages(saveSelectedImages);
        
            if (window.naver) {
                const { naver } = window;
                const coord = new naver.maps.LatLng(image.mapy, image.mapx);
                const marker = new naver.maps.Marker({
                    position: coord,
                    map: mapRef.current,
                    title: image.placeTitle
                });
                markersRef.current.push(marker);
            }
        
            // 2개 이상의 이미지가 선택되면 경로 및 소요시간 계산
            if (saveSelectedImages.length >= 2) {
                calculateDurations(saveSelectedImages).then(() => {
                    handleSave(saveSelectedImages);
                });
            }
        } else {
            alert("4개까지만 선택할 수 있습니다.");
        }
    };

    
    //선택된 이미지 초기화
    const clearSelectedImages = () => {
        setSelectedImages([]);
        setDurations([]);

        if (lineRefs.current.length > 0) {
            lineRefs.current.forEach(line => line.setMap(null));
            lineRefs.current = [];
        }
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (mapRef.current) {
            mapRef.current.setCenter(new window.naver.maps.LatLng(37.5665, 126.9780));
            mapRef.current.setZoom(8);
        }
    }

    //네이버 맵 호출
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

        axios.get('https://gangwonactivity.site/api/v1/getmap')
            .then(response => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = response.data;
                script.onload = initMap;
                document.head.appendChild(script);
            })
            .catch(error => console.error('Error fetching map script:', error));
    }, []);

    // 선택된 이미지 경로 표시
    const handleSave = (saveSelectedImages) => {
        const imagesToUse = saveSelectedImages || selectedImages;
        if (imagesToUse.length >= 2 && window.naver) { // 2개 이상일 때 경로와 마커 표시
            const { naver } = window;
            const coordinates = imagesToUse.map(image => new naver.maps.LatLng(image.mapy, image.mapx));
            console.log('좌표:', coordinates);

            if (!coordinates || coordinates.length < 2) {
                alert("좌표가 유효하지 않습니다. 최소 두 개의 좌표가 필요합니다.");
                return;
            }

            // 이전에 그려진 경로와 마커 제거
            if (lineRefs.current.length > 0) {
                lineRefs.current.forEach(line => line.setMap(null));
                lineRefs.current = [];
            }

            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            pathData.current.forEach(path => {
                const pathCoordinates = path.map(point => new naver.maps.LatLng(point[1], point[0]));
                const polyline = new naver.maps.Polyline({
                    map: mapRef.current,
                    path: pathCoordinates,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1,
                    strokeWeight: 4
                });
                lineRefs.current.push(polyline);
            });

            // 마커 추가
            coordinates.forEach((coord, index) => {
                const marker = new naver.maps.Marker({
                    position: coord,
                    map: mapRef.current,
                    title: `Location ${index + 1}`
                });
                markersRef.current.push(marker);
            });

            // 경로에 맞게 지도 범위 조정
            const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new naver.maps.LatLngBounds());

            mapRef.current.fitBounds(bounds);
        }
    };

    //소요시간 출력
    const calculateDurations = (images) => {
        const durationPromises = [];
        const updatedPathData = [];

        for (let i = 0; i < images.length - 1; i++) {
            const start = images[i];
            const end = images[i + 1];

            durationPromises.push(
                axios.post('https://gangwonactivity.site/api/v1/getdrive', {
                    startLat: start.mapy,
                    startLng: start.mapx,
                    endLat: end.mapy,
                    endLng: end.mapx
                }).then(response => {
                    const data = response.data;
                    console.log(data);

                    if (data.route && data.route.traoptimal && data.route.traoptimal[0]) {
                        updatedPathData.push(data.route.traoptimal[0].path);
                        const duration = data.route.traoptimal[0].summary.duration;
                        return formatDuration(duration);
                    }
                    return 'N/A';
                })
            );
        }

        return Promise.all(durationPromises).then(durations => {
            console.log('Durations:', durations);
            console.log('Updated Path Data:', updatedPathData);

            setDurations(durations);
            pathData.current = updatedPathData;
        }).catch(error => console.error('Error fetching durations:', error));
    }

    //소요시간 포맷
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

    //슬라이드 왼쪽 이벤트
    const scrollLeft = () => {
        setCurrentImageIndex(prevIndex => (prevIndex === 0 ? Math.ceil(images.length / 4) - 1 : prevIndex - 1));
    }
    
    //슬라이드 오른쪽 이벤트
    const scrollRight = () => {
        setCurrentImageIndex(prevIndex => (prevIndex === Math.ceil(images.length / 4) - 1 ? 0 : prevIndex + 1));
    }    

    // 코스 저장
    const saveSelectedImages = () => {
        if (selectedImages.length !== 4) {
            alert("4개의 플레이스를 선택해야 합니다.");
            return;
        }

        const courseData = selectedImages.map((image, index) => ({
            placeNo: image.placeNo,
            orderNo: index + 1,
        }));

        console.log('Course Data:', courseData);

        axios.post('https://gangwonactivity.site/api/v1/getmycourse/getcourse', {
            userId: userId,
            courseData: courseData
        })
            .then(response => {
                const responseData = response.data;

                if (responseData.code === 'SU') { // SUCCESS
                    alert('코스가 저장되었습니다.');
                } else {
                    alert(responseData.message || '알 수 없는 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                if (error.response) {
                    const responseData = error.response.data;
                    console.log('Error Response Data:', responseData); // 에러 응답 데이터 디버그 출력
                    let alertMessage = responseData.message;
                    if (responseData.code === 'CE') {
                        alertMessage = '이미 존재하는 코스입니다.';
                    } else if (responseData.code === 'SU') {
                        alertMessage = '코스가 저장되었습니다.';
                    } else {
                        alertMessage = alertMessage || '코스 저장에 실패했습니다.';
                    }
                    alert(alertMessage);
                }
            });
    };

    // 이미지 선택 해제 이벤트
    const removeImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);

        // 선택된 이미지를 삭제할 때 해당 마커도 삭제
        if (markersRef.current[index]) {
            markersRef.current[index].setMap(null);
            markersRef.current.splice(index, 1); // 마커 배열에서도 삭제
        }

        // 선택된 이미지가 변경되었을 때 경로 및 마커를 다시 계산
        if (updatedImages.length >= 2) {
            calculateDurations(updatedImages).then(() => {
                handleSave(updatedImages);
            });
        } else if (updatedImages.length === 1) {
            // 이미지가 하나만 남았을 때, 기존 경로는 삭제하고 마커는 유지
            if (lineRefs.current.length > 0) {
                lineRefs.current.forEach(line => line.setMap(null));
                lineRefs.current = [];
            }
        } else {
            // 0개일 경우 지도를 초기화
            clearSelectedImages();
        }
    };


    return (
        <div className="CreateMyCourseContainer">

            <div className="CreateMyCourseFavoritePlaceList"> 
                <h2>찜 리스트</h2>
                <div className="CreateMyCourseExpl">
                    <h3>4개의 플레이스를 선택해주세요!</h3>
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
                    {images.slice(currentImageIndex * 4, (currentImageIndex + 1) * 4).map((image, index) => (
                        <div key={index} className="FavoritePlaceListImageContainer">
                            <img
                                src={image.firstImage2 || defaultImage}
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
            </div>
            
            <div className="CreateMyCourseTourCombination">
                <h2>관광지 조합</h2>
                <div className="CreateMyCourseTourCombinationList">
                    {selectedImages.map((image, index) => (
                        <div className="CreateMyCourseTourItem" key={index}>
                            <button className="remove-btn" onClick={() => removeImage(index)}>X</button>
                            <img src={image.firstImage2 || defaultImage} alt={image.placeTitle} />
                            <div className="image-title">{image.placeTitle}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="TotalRoute">
                <h2>경로 총정리</h2>

                <div className='map-container'>
                <div ref={mapContainer} className="map"></div>
                    <div className="CourseContainer">
                        {selectedImages.map((image, index) => (
                            <div key={index}>
                                <div className="CourseItem">
                                    <div className="CourseIndex">{index + 1}</div>
                                    <div className="CourseTitle">{image.placeTitle}</div>
                                </div>
                                {index < selectedImages.length - 1 && (
                                    <div className="duration"><img src={Car} alt="Car" />{durations[index]}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className='CreateMyCourseConfirm'>
                    <button onClick={saveSelectedImages}>저장</button>
                    <button onClick={clearSelectedImages}>취소</button>
                </div>
            </div>

            <div className='CreateMyCourseWeather'>
                <h2>날씨 전망</h2>
            </div>
        </div>
    );
}

export default CreateMyCourse;
