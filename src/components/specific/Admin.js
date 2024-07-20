import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Admin.css';

function Admin() {
    const navigate = useNavigate();

    const handleReportClick = () => {
        navigate('/report');
    };

    const handleUserListClick = () => {
        navigate('/AllUserList');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        // 토큰과 역할이 모두 존재해야 하며, 역할이 관리자여야 함
        if (!token || userRole !== 'ROLE_ADMIN') {
            alert('접근 권한이 없습니다.');
            navigate('/ErrorPage');
        }
    }, [navigate]);

    return (
        <div className='Admin'>
            <div className='reportList'>
                <div className="content-List">
                    <h2 onClick={handleReportClick} style={{ cursor: 'pointer' }}>신고받은 글 / 댓글</h2>
                </div>

                <div className="User-List">
                    <h2 onClick={handleUserListClick} style={{ cursor: 'pointer' }}>회원 관리</h2>
                </div>
            </div>
        </div>
    );
}

export default Admin;
