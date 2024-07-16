
import React, {  useState } from 'react';
// import React, { useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/PostBoard.css';
import axios from 'axios';

function PostBoard(){

    const nav = useNavigate();

    const handleCancel =() =>{
        nav(-1);        
    }

    // 이미지 업로드 및 취소
    const [images, setImages] = useState([]);
    // const [existingImages, setExistingImages] = useState([]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);

        files.forEach(file => uploadFile(file));
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
      };

    const [postData, setPostData] = useState({
        boardTitle:'',
        content:'',
        imageAddress : []
    });

    const {boardTitle, content, imageUrls} = postData;

    const onChange = (e) => {
        const {name, value} = e.target;
        setPostData({
            ...postData,
            [name] : value
        });
    };

    // 파일 URL을 저장할 상태
    const [fileUrls, setFileUrls] = useState([]);

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
       

    const handleSubmit = async () => {
        try {

            // 게시글 작성 API 호출
            const token = localStorage.getItem('token'); // 토큰 가져오기
            const response = await axios.post('http://localhost:4040/api/v1/board', {
                title: boardTitle,
                content: content,
                boardImageList:  fileUrls// 이미지 URL 전송
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Post submitted successfully:', response);
            // 페이지 이동 등 추가 작업 수행
            nav('/community');
        } catch (error) {
            console.error('Error submitting post:', error);

        }
    };
    

    return(
       
        <div id = "board-write">

            <div className='board-write-box'>
                <div className='board-write-title'>
                    <input className='board-write-title-input' type='text' name="boardTitle" value={boardTitle} onChange={onChange} placeholder='제목을 작성해주세요.' ></input>
                </div>
                   
                <hr className="PostWrite-header-line"/>

                <div className='board-write-content'>
                    <textarea  className='board-write-content-textarea' name="content" value={content} onChange={onChange} placeholder='본문을 작성해주세요.' ></textarea>
                    <div className='mycourse-image-upload-button'>
                        <button className='upload-button'>나만의 코스 불러오기</button><br/>
                        {/* <button className='upload-button'>이미지 불러오기</button> */}
                        <input type="file" name="file" multiple onChange={handleImageChange} />
                    </div>
                   
                    {/* <input  type='file' accept='image/*' style={{display : 'none'}}/>  */}
                </div>
               
                <div className='board-write-image'>
                    {images.map((src, index) => (
                        <div key={index} className="write-image-container">
                        <img src={src} alt={`img-${index}`} className="write-image" />
                        <span className="close-btn" onClick={() => removeImage(index)}>X</span>
                        </div>
                    ))}
                </div>
                <div className='board-submit-cancel'>
                    <button onClick={handleCancel} className='board-write-cancel'>취소</button>
                    <button onClick={handleSubmit} className='board-write-submit'>완료</button>
                </div>
            </div>
       
               
        </div>
    )
    
    
  }


export default PostBoard;