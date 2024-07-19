import React from 'react';
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
