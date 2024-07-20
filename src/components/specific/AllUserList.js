import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/AllUserList.css';

function AllUserList() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page')) || 1; // 기본 페이지를 1로 설정

    const [userList, setUserList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
    const [currentPage, setCurrentPage] = useState(page); // 현재 페이지 설정

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        // 토큰과 역할이 모두 존재해야 하며, 역할이 관리자여야 함
        if (!token || userRole !== 'ROLE_ADMIN') {
            alert('접근 권한이 없습니다.');
            navigate('/ErrorPage');
        }
    }, [navigate]);
    
    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    useEffect(() => {
        // API 호출하여 사용자 데이터 가져오기
        fetch(`http://localhost:4040/api/v1/admin/getuserlist?page=${currentPage - 1}&size=15`)
            .then(response => response.json())
            .then(data => {
                if (data && data.content) {
                    setUserList(data.content);
                    setTotalPages(data.totalPages);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [currentPage]);

    const handleCheckboxChange = (userNo) => {
        setSelectedUsers(prev =>
            prev.includes(userNo)
                ? prev.filter(id => id !== userNo)
                : [...prev, userNo]
        );
    };

    const handleAllCheckboxChange = (event) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedUsers(userList.map(user => user.userNo));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleUserRestriction = async () => {
        if (window.confirm('해당 유저를 제재하시겠습니까?')) {
            try {
                await Promise.all(selectedUsers.map(userNo =>
                    fetch('http://localhost:4040/api/v1/admin/sanction', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userNo),
                    })
                ));
                alert('유저가 제재되었습니다.');
                setSelectedUsers([]); // 선택된 사용자 목록 초기화
                navigate(0); 
            } catch (error) {
                console.error('Error sanctioning users:', error);
                alert('유저 제재에 실패했습니다.');
            }
        }
    };

    const handleReuser = async () => {
        if (window.confirm('선택된 유저를 탈퇴 해제하시겠습니까?')) {
            try {
                await Promise.all(selectedUsers.map(userNo => {
                    const user = userList.find(user => user.userNo === userNo);
                    return fetch('http://localhost:4040/api/v1/admin/reuser', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: user.userId }),
                    })
                }));
                alert('선택된 유저가 탈퇴 해제되었습니다.');
                setSelectedUsers([]); // 선택된 사용자 목록 초기화
                navigate(0); 
            } catch (error) {
                console.error('Error desanctioning users:', error);
                alert('유저 탈퇴 해제에 실패했습니다.');
            }
        }
    }

    const handleDesanction = async () => {
        if (window.confirm('선택된 유저를 제재 해제하시겠습니까?')) {
            try {
                await Promise.all(selectedUsers.map(userNo =>
                    fetch('http://localhost:4040/api/v1/admin/desanction', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userNo),
                    })
                ));
                alert('선택된 유저가 제재 해제되었습니다.');
                setSelectedUsers([]); // 선택된 사용자 목록 초기화
                navigate(0); 
            } catch (error) {
                console.error('Error desanctioning users:', error);
                alert('유저 제재 해제에 실패했습니다.');
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            navigate(`/admin?page=${newPage}`);
        }
    };

    return (
        <div className="AllUserList">
            <div className="UserList">
                <h2>회원 관리</h2>
            </div>

            <table className="report-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                id="all"
                                onChange={handleAllCheckboxChange}
                                checked={userList.length > 0 && selectedUsers.length === userList.length}
                            />
                        </th>
                        <th>userNo</th>
                        <th>이름</th>
                        <th>ID</th>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>제재 여부</th>
                        <th>탈퇴 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map(user => (
                        <tr key={user.userNo}>
                            <td>
                                <input
                                    type="checkbox"
                                    id={`user-${user.userNo}`}
                                    onChange={() => handleCheckboxChange(user.userNo)}
                                    checked={selectedUsers.includes(user.userNo)}
                                />
                            </td>
                            <td>{user.userNo}</td>
                            <td>{user.userName}</td>
                            <td>{user.userId}</td>
                            <td>{user.userNick}</td>
                            <td>{user.userEmail}</td>
                            <td>{user.userBanTime ? user.userBanTime.split('T')[0] : ''}</td>
                            <td>{user.userExitTime? user.userExitTime.split('T')[0] : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="user-desanction">
                <button className="login-restriction" onClick={handleUserRestriction}>로그인 정지</button>
                <button className="report-desanction" onClick={handleDesanction}>유저 제재 해제</button>
                <button className="reuser" onClick={handleReuser}>유저 탈퇴 해제</button>
            </div>

            <div className="user-pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage <= 1}
                    className="page-button"
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page} 
                        onClick={() => handlePageChange(page)} 
                        className={`page-number ${page === currentPage ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage >= totalPages}
                    className="page-button"
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default AllUserList;
