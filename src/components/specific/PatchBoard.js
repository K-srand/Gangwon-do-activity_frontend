import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/PatchBoard.css';
import LoadMyCourse from '../specific/LoadMyCourse';
import defaultImage from '../../assets/images/Icon_No_Image.png';
import axios from 'axios';

function EditPostBoard() {
    const nav = useNavigate();
    const { boardNo } = useParams();

    const [images, setImages] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);
    const [existingFileUrls, setExistingFileUrls] = useState([]); // 기존 이미지 URL을 저장하는 상태

    const [myCourse, setMyCourse] = useState([]);
    const [removeAddress, setRemoveAddress] = useState("");

    useEffect(() => {
        // 기존 글 데이터 가져오기
        const token = localStorage.getItem('token');
        axios.get(`https://3.36.27.202:4040/api/v1/board/${boardNo}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            const data = res.data;
            setPostData({
                boardTitle: data.boardTitle,
                content: data.content,
            });

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

    const getImgUrl = () => {
        const token = localStorage.getItem('token');
        axios.get(`https://3.36.27.202:4040/api/v1/board/image/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            setExistingFileUrls(res.data); // 기존 이미지 URL을 상태로 저장
            setRemoveAddress(res.data);
        })
        .catch(function(error) {
            console.error("There was an error!", error);
        });
    }

    useEffect(() => {
        getImgUrl();
    },[]);

    const handleCancel = () => {
        nav(-1);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);

        files.forEach(file => uploadFile(file));
    };

    const addFileUrl = (fileUrl) => {
        setFileUrls((prevFileUrls) => [...prevFileUrls, fileUrl]);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // 토큰 가져오기
            const response = await axios.post('https://3.36.27.202:4040/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const fileUrl = response.data;
            console.log('Uploaded image URL:', fileUrl);
            addFileUrl(fileUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // 업로드 실패 시 에러 처리
        }
    };

    const removeImage = async (index) => {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        try {
            if (!token) {
                throw new Error('No token found');
            }
            await axios({
                method: 'delete',
                url: 'https://3.36.27.202:4040/file/delete',
                headers: {
                    Authorization: `Bearer ${token}`, // 백틱(`) 사용
                    'Content-Type': 'application/json'
                },
                data: {
                    fileUrl: removeAddress[index]
                }
            });
            nav(`/patch/${boardNo}`)
            console.log("Image removed: ", removeAddress);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error; // 삭제 실패 시 에러 처리
        }
    };

    const [postData, setPostData] = useState({
        boardTitle: '',
        content: '',
    });

    const { boardTitle, content } = postData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setPostData({
            ...postData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');

        axios.patch(`https://3.36.27.202:4040/api/v1/board/patch/${boardNo}`, {
            title: boardTitle,
            content: content,
            boardImageList: fileUrls // 새 이미지 URL만 전송
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(fileUrls);
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
       
        axios.patch(`https://3.36.27.202:4040/api/v1/board/updatemycourse/${boardNo}`, {
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
        axios.patch(`https://3.36.27.202:4040/api/v1/board/deletemycourse/${boardNo}`, {
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
                    <textarea className='board-write-content-textarea' name="content" value={content} onChange={onChange} placeholder='본문을 작성해주세요.' >
                    {content.split("\n").map((line) => { 
                        return (
                        <span>
                            {line}
                            <br />
                        </span>
                    );})}   
                    </textarea>
                    <div className='mycourse-image-upload-button'>
                        <button className="upload-button" onClick={openModal}>나만의 코스 불러오기</button><br />
                        {isModalOpen && <LoadMyCourse closeModal={closeModal} onCourseSelect={handleCourseSelect} />}
                        <input type="file" multiple onChange={handleImageChange} />
                    </div>
                </div>
                <div className='board-write-image'>
                    {existingFileUrls.map((src, index) => (
                        <div key={index} className="write-image-container">
                            <img src={src} alt={`img-${index}`} className="write-image" />
                            <span className="close-btn" onClick={() => {
                                removeImage(index);
                            }}>X</span>
                        </div>
                    ))}
                    {fileUrls.map((src, index) => (
                        <div key={index} className="write-image-container">
                            <img src={src} alt={`img-${index}`} className="write-image" />
                            <span className="close-btn" onClick={() => {
                                removeImage(index);
                                setFileUrls(fileUrls.filter((_, i) => i !== index));
                            }}>X</span>
                        </div>
                    ))}
                </div>

                <div className='myCourse'>
                    {myCourse.length > 0 ? myCourse.map((course, index) => (
                        <div className="course-container" key={index}>
                            <img className="course-images" src={course.imageUrl || defaultImage} alt={`image-${index}`} />
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