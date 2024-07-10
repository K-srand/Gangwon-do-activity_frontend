import React, { useState } from 'react';
import "../../assets/styles/CreateMyCourse.css"
import axios from 'axios';

const MyPlace = () => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const category = (value) => {
        axios.post('http://localhost:4040/api/v1/getmycourse/getplacecat', {
            placeCat: value
        })
        .then(response => {
            console.log(response.data);
            setImages(response.data);  // 전체 이미지 객체 배열을 저장
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }

    const selectImage = (image) => {
        if (selectedImages.length < 4) {
            setSelectedImages([...selectedImages, image]);
        } else {
            alert("4개까지만 선택할 수 있습니다.");
        }
    }

    const clearSelectedImages = () => {
        setSelectedImages([]);
    }

    return (
        <div className="CreateMyCourse">
            <div className="MyPlaceList">
                <h2>찜 리스트</h2>
            </div>

            <div className="Category">
                <button onClick={() => category('activity')} className="button">액티비티</button>
                <button onClick={() => category('restaurant')} className="button">식당</button>
                <button onClick={() => category('cafe')} className="button">카페</button>
                <button onClick={() => category('tour')} className="button">관광지</button>
                <button onClick={() => category('accommodation')} className="button">숙박</button>
            </div>

            <div className="ImageList">
                {images.map((image, index) => (
                    <img 
                        key={index} 
                        src={image.firstImage2} 
                        alt={image.placeTitle} 
                        onClick={() => selectImage(image)} 
                        className="selectable-image"
                    />
                ))}
            </div>

            <div className="TourCombination">
                <h2>관광지 조합</h2>
                <div className="tour-combination-list">
                    {selectedImages.map((image, index) => (
                        <div className="tour-item" key={index}>
                            <img src={image.firstImage2} alt={image.placeTitle} />
                        </div>
                    ))}
                </div>
            </div>

            <div className='Confirm'>
                <button>저장</button>
                <button onClick={clearSelectedImages}>취소</button>
            </div>
        </div>
    );
}

export default MyPlace;
