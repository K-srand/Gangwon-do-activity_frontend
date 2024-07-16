import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/PostBoard.css';
import axios from 'axios';

function EditPostBoard() {
    const nav = useNavigate();
    const { boardNo } = useParams();

    const [images, setImages] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);
    const [removeAddress, setRemoveAddress] = useState("");

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
                // imageAddress: data.imageAddress || []
            });
            // setExistingImages(data.imageAddress || []);
        })
        .catch(err => {
            console.log(err);
        });
    }, [boardNo]);

    let imageAddress = "";
    const getImgUrl = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:4040/api/v1/board/image/${boardNo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(function(res){
            setFileUrls(res.data);
            setRemoveAddress(res.data);
            imageAddress = res.data;
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
        if(files.length === 0) return ;
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);

        files.forEach(file => uploadFile(file));
    };


    // 새로운 fileUrl을 fileUrls 배열에 추가하는 함수
    const addFileUrl = (fileUrl) => {
    setFileUrls((prevFileUrls) => [...prevFileUrls, fileUrl]);
    };
    
    let fileUrl ="" ;
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // 토큰 가져오기
            const response = await axios.post('http://localhost:4040/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            fileUrl = response.data;
            console.log('Uploaded image URL:', fileUrl);
            addFileUrl(fileUrl);
            return fileUrls; // 업로드된 이미지의 URL 반환
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // 업로드 실패 시 에러 처리
        }
    };

    const removeImage = async (index) => {
        console.log("removeAddress?????:", removeAddress[index]);
        const token = localStorage.getItem('token'); // 토큰 가져오기
        try {
            if (!token) {
                throw new Error('No token found');
            }
            await axios({
                method: 'delete',
                url: 'http://localhost:4040/file/delete',
                headers: {
                    Authorization: `Bearer ${token}`, // 백틱(`) 사용
                    'Content-Type': 'application/json'
                },
                data: {
                    fileUrl: removeAddress[index]
                }
            });
            console.log("Image removed: ", removeAddress);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error; // 삭제 실패 시 에러 처리
        }
    };

    const [postData, setPostData] = useState({
        boardTitle: '',
        content: '',
        imageAddress: []
    });

    const { boardTitle, content} = postData;

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
            boardImageList:  fileUrls// 이미지 URL 전송
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
                        <input type="file" multiple onChange={handleImageChange} />
                    </div>
                </div>
                <div className='board-write-image'>
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
                <div className='board-submit-cancel'>
                    <button onClick={handleCancel} className='board-write-cancel'>취소</button>
                    <button onClick={handleSubmit} className='board-write-submit'>수정</button>
                </div>
            </div>
        </div>
    );
}

export default EditPostBoard;