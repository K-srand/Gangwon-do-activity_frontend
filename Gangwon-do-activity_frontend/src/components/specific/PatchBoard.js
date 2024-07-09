import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/PostBoard.css';
import axios from 'axios';

function EditPostBoard() {
    const nav = useNavigate();
    const { boardNo } = useParams();

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        // 기존 글 데이터 가져오기
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:4040/api/v1/board/${boardNo}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            const data = res.data;
            setPostData({
                boardTitle: data.boardTitle,
                content: data.content,
                imageAddress: data.imageAddress || []
            });
            setExistingImages(data.imageAddress || []);
        })
        .catch(err => {
            console.log(err);
        });
    }, [boardNo]);

    const handleCancel = () => {
        nav(-1);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const [postData, setPostData] = useState({
        boardTitle: '',
        content: '',
        imageAddress: []
    });

    const { boardTitle, content, imageAddress } = postData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setPostData({
            ...postData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`image${index}`, image);
        });

        axios.patch(`http://localhost:4040/api/v1/board/patch/${boardNo}`, {
            title: boardTitle,
            content: content,
            imageAddress: imageAddress
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(res);
            window.location.href = `/postWrite/${boardNo}`;
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div id="board-write">
            <div className='board-write-box'>
                <div className='board-write-title'>
                    <input className='board-write-title-input' type='text' name="boardTitle" value={boardTitle} onChange={onChange} placeholder='제목을 작성해주세요.' />
                </div>
                <hr className="PostWrite-header-line" />
                <div className='board-write-content'>
                    <textarea className='board-write-content-textarea' name="content" value={content} onChange={onChange} placeholder='본문을 작성해주세요.' ></textarea>
                    <div className='mycourse-image-upload-button'>
                        <button className='upload-button'>나만의 코스 불러오기</button><br />
                        <input type="file" multiple onChange={handleImageUpload} />
                    </div>
                </div>
                <div className='board-write-image'>
                    {existingImages.map((src, index) => (
                        <div key={index} className="write-image-container">
                            <img src={src} alt={`img-${index}`} className="write-image" />
                            <span className="close-btn" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}>X</span>
                        </div>
                    ))}
                    {images.map((src, index) => (
                        <div key={index} className="write-image-container">
                            <img src={src} alt={`img-${index}`} className="write-image" />
                            <span className="close-btn" onClick={() => removeImage(index)}>X</span>
                        </div>
                    ))}
                </div>
                <div className='board-submit-cancel'>
                    <button onClick={handleCancel} className='board-write-cancel'>취소</button>
                    <button onClick={handleSubmit} className='board-write-submit'>수정</button>
                </div>
            </div>
        </div>
    );
}

export default EditPostBoard;