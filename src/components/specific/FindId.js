import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/Find.css';
import logo from '../../assets/images/MainLogo.png';
import CertificationId from './CertificationId';
import Modal from 'react-modal';


const FindId = () => {
    const [form, setForm] = useState({ userName: '', userEmail: '' });
    const navigate = useNavigate();
    const certificationNumber = sessionStorage.getItem('certificationNumber');
    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1/auth';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // userId도 함께 확인

        if (token && userId) {
          navigate('/');
        }
    }, [navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태

    const handleEmailCertification = async () => {
        if (!form.userEmail) {
            alert('이메일을 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post(API_DOMAIN + '/email-certification', {
                email: form.userEmail
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // 세션 정보 포함
            });
            if (response.data.code === 'SU') {
                alert('인증번호가 발송되었습니다.');
                sessionStorage.setItem('email', form.userEmail);
                sessionStorage.setItem('userName', form.userName);
                setModalIsOpen(true); // 모달 열기
            } else {
                alert('이메일 인증 요청에 실패하였습니다: ' + (response.data.message || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Error during email certification request:', error);
            if (error.response) {
                const result = error.response.data;
                if (result.code === 'NU') {
                    alert('유저가 존재하지 않습니다.');
                    
                } else if (result.code === 'NE') {
                    alert('인증번호가 맞지 않습니다.');
                   
                } else {
                    alert('이메일 인증 요청에 실패하였습니다: ' + (result.message || '알 수 없는 오류'));
                }
            } else {
                alert('이메일 인증 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        try {
            const response = await axios.post(API_DOMAIN + '/findId-certification', {
                userName: form.userName,
                email: form.userEmail,
                certificationNumber: certificationNumber
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            const result = response.data;
            console.log('findId Response:', result);

            if (result.code === 'SU') {
                alert('Id 찾기 메일을 보냈습니다.');
                navigate('/logindetail'); // 로그인 페이지로
            } else {
                alert(`실패했습니다: ${result.message || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error('Error during findId:', error);
            if (error.response) {
                const result = error.response.data;
                if (result.code === 'NU') {
                    alert('유저가 존재하지 않습니다.');
                    
                } else if (result.code === 'NE') {
                    alert('인증번호가 맞지 않습니다.');
                    
                } else {
                    alert(`오류가 발생했습니다: ${result.message || '알 수 없는 오류'}`);
                }
            } else {
                alert('오류가 발생했습니다.');
            }
        }
    };

    return (
        <div>
            <div className='find-modal-main'>
                <div className='find-modal-main-logo'>
                    <img src={logo} alt="Logo"></img>
                </div>
                <div className='find-modal-main-textbox'>
                    <div className='bold'>아이디 찾기</div>
                    <div className='detail1'>가입시 등록한 이메일을 입력해주세요.</div>
                    <div className='detail2'>이메일 인증을 통해 아이디 찾기가 가능합니다.</div>
                </div>
                <div className='find-modal-main-inputbox'>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="userName">*이름</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            className='FindId1'
                            value={form.userName}
                            onChange={handleChange}
                        />
                        <label htmlFor="userEmail">*가입한 이메일</label>
                        <div className='form-detail'>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                className='email-input'
                                value={form.userEmail}
                                onChange={handleChange}
                            />
                            <button type='button' onClick={handleEmailCertification}>인증</button>
                        </div>
                        <div className='find-modal-main-accept'>
                            <button type="submit">확인</button>
                        </div>
                    </form>
                </div>
                <div className='find-find'>
                    <div className='link'>
                        <a href='/findpassword'>비밀번호 찾기</a>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Email Certification Modal"
                className="certification-modal"
                overlayClassName="certification-overlay"
            >
                <CertificationId closeModal={() => setModalIsOpen(false)} setIsEmailVerified={setIsEmailVerified} />
            </Modal>
        </div>
    );
};

export default FindId;
