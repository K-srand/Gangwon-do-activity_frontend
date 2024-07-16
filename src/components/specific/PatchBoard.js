import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/PatchBoard.css';
import LoadMyCourse from '../specific/LoadMyCourse';
import axios from 'axios';

function EditPostBoard() {
    const nav = useNavigate();
    const { boardNo } = useParams();

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [myCourse, setMyCourse] = useState([]);


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
                imageAddress: data.imageAddress || [],
            });
            setExistingImages(data.imageAddress || []);

            if (res.data.firstImage2 && Array.isArray(res.data.firstImage2)) {
                const courseDetails = res.data.firstImage2.map(imageObj => ({
                    placeTitle: imageObj.placeTitle,
                    imageUrl: imageObj.firstImage2
                }));
                setMyCourse(courseDetails);
            } else {
                setMyCourse([]);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }, [boardNo]);

    const handleCancel = () => {
        nav(-1);
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const fileUrl = response.data;
                setExistingImages([...existingImages, fileUrl]);
                alert('File uploaded successfully!');
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        }
    };


    // const handleImageUpload = (event) => {
    //     const files = Array.from(event.target.files);
    //     const newImages = files.map(file => URL.createObjectURL(file));
    //     setImages([...images, ...newImages]);
    // };

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
            window.location.href = `/BoardDetail/${boardNo}`;
        })
        .catch((err) => {
            console.log(err);
        });
    };

    //나만의 코스 불러오기 모달창
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCourseSelect = (courseInfo) => {
        console.log('선택된 코스 정보:', courseInfo);
       
        axios.patch(`http://localhost:4040/api/v1/board/updatemycourse/${boardNo}`, {
            myCourseNo: courseInfo[0].myCourseNo
        })

        const allCourseDetails = courseInfo.map(imageObj => ({
            placeTitle: imageObj.placeTitle,
            imageUrl: imageObj.firstImage2
        }));
    
        setMyCourse(allCourseDetails);
           

        setIsModalOpen(false);
        
    };


    const courseDelete = () => {
        const token = localStorage.getItem('token');
    axios.patch(`http://localhost:4040/api/v1/board/deletemycourse/${boardNo}`, {
        boardNo: boardNo
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        setMyCourse([]); // Clear myCourse state to remove from UI
    })
    .catch(err => {
        console.error(err);
        alert('Failed to delete course');
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
                    <button className="upload-button" onClick={openModal}>나만의 코스 불러오기</button><br />{isModalOpen && <LoadMyCourse closeModal={closeModal} onCourseSelect={handleCourseSelect} />}
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

                <div className='myCourse'>
                    {myCourse.length > 0 ? myCourse.map((course, index) => (
                        <div className="course-container" key={index}>
                            <img className="course-images" src={course.imageUrl} alt={`image-${index}`} />
                            <h4>{course.placeTitle}</h4>
                        </div>
                    )) : null}   
                    {myCourse.length > 0 && <button onClick={courseDelete} className='courseDelete'>X</button>}
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