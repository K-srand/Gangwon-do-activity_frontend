
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

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
      };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
      };

    const [postData, setPostData] = useState({
        boardTitle:'',
        content:'',
        imageAddress : []
    });

    const {boardTitle, content, imageAddress} = postData;

    const onChange = (e) => {
        const {name, value} = e.target;
        setPostData({
            ...postData,
            [name] : value
        });
    };

    const handleSubmit = () =>{
        const token = localStorage.getItem('token'); // 토큰 가져오기
        const formData = new FormData();
            images.forEach((image, index) => {
                formData.append(`image${index}`, image);
            });

        axios.post('http://localhost:4040/api/v1/board', {
            title : boardTitle,
            content : content,
            imageAddress : imageAddress
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            console.log(res);
            // 페이지이동
            window.location.href ='/community';
        })
        .catch((err) =>{
            console.log(err);
        });
           
    }

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
                        <input type="file" multiple onChange={handleImageUpload} />
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