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

    useEffect(() => {
        axios.get('http://localhost:4040/api/v1/user', {
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

    const category = (value) => {
        axios.post('http://localhost:4040/api/v1/getmycourse/getplacecat', {
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

    const selectImage = (image) => {
        if (selectedImages.length < 4) {
            const saveSelectedImages = [...selectedImages, image];
            setSelectedImages(saveSelectedImages);

            if (saveSelectedImages.length === 4) {
                calculateDurations(saveSelectedImages).then(() => {
                    handleSave(saveSelectedImages);
                });
            }
        } else {
            alert("4개까지만 선택할 수 있습니다.");
        }
    }

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

        axios.get('http://localhost:4040/api/v1/getmap')
            .then(response => {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = response.data;
                script.onload = initMap;
                document.head.appendChild(script);
            })
            .catch(error => console.error('Error fetching map script:', error));
    }, []);

    const handleSave = (saveSelectedImages) => {
        const imagesToUse = saveSelectedImages || selectedImages;
        if (imagesToUse.length === 4 && window.naver) {
            const { naver } = window;
            const coordinates = imagesToUse.map(image => new naver.maps.LatLng(image.mapy, image.mapx));
            console.log('좌표:', coordinates);

            if (!coordinates || coordinates.length < 2) {
                alert("좌표가 유효하지 않습니다. 최소 두 개의 좌표가 필요합니다.");
                return;
            }

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

    const calculateDurations = (images) => {
        const durationPromises = [];
        const updatedPathData = [];

        for (let i = 0; i < images.length - 1; i++) {
            const start = images[i];
            const end = images[i + 1];

            durationPromises.push(
                axios.post('http://localhost:4040/api/v1/getdrive', {
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

    const scrollLeft = () => {
        setCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }

    const scrollRight = () => {
        setCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, Math.ceil(images.length / 4) - 1));
    }

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

        axios.post('http://localhost:4040/api/v1/getmycourse/getcourse', {
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
                {images.slice(currentImageIndex * 4, (currentImageIndex + 1) * 4).map((image, index) => (
                    <div key={index} className="image-container">
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

            <div className="CreateMyCourseTourCombination">
                <h2>관광지 조합</h2>
                <div className="CreateMyCourseTourCombinationList">
                    {selectedImages.map((image, index) => (
                        <div className="CreateMyCourseTourItem" key={index}>
                            <img src={image.firstImage2 || defaultImage} alt={image.placeTitle} />
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

            <div className="CreateMyCourse">
                <div className='Weather'>
                    <h2>날씨 전망</h2>
                </div>
            </div>
        </div>
    );
}

export default CreateMyCourse;
