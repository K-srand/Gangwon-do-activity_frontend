import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/Report.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Report() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page')) || 1;

    const [reportedData, setReportedData] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);

    const DOMAIN = 'https://gangwonactivity.site';
    const API_DOMAIN = DOMAIN + '/api/v1';

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
        const fetchReportedData = async () => {
            try {
                const response = await axios.get(API_DOMAIN + `/report/?page=${currentPage - 1}&size=15`);
                const pageData = response.data;
                setReportedData(pageData.content);
                setTotalPages(pageData.totalPages);
                console.log("data? : ", pageData);
            } catch (error) {
                console.error('Error fetching reported data:', error);
            }
        };

        fetchReportedData();
    }, [currentPage]);

    const handleDelete = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await Promise.all(selectedReports.map(reportedContentNo => 
                    axios.delete(API_DOMAIN + '/report/delete/${reportedContentNo}')
                ));
                setReportedData(reportedData.filter(report => !selectedReports.includes(report.reportedContentNo)));
                setSelectedReports([]);
            } catch (error) {
                console.error('Error deleting reported data:', error);
                navigate('/report');
            }
        }
    };

    const handleCheckboxChange = (reportedContentNo) => {
        setSelectedReports(prev =>
            prev.includes(reportedContentNo)
                ? prev.filter(id => id !== reportedContentNo)
                : [...prev, reportedContentNo]
        );
    };

    const handleAllCheckboxChange = (event) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedReports(reportedData.map(report => report.reportedContentNo));
        } else {
            setSelectedReports([]);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            navigate(`/report?page=${newPage}`);
        }
    };

    const handleContentRestriction = async () => {
        if (window.confirm('해당 콘텐츠를 제재하시겠습니까?')) {
            try {
                await Promise.all(selectedReports.map(reportedContentNo => {
                    return axios.patch(API_DOMAIN + '/admin/sanctioncontent', reportedContentNo, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }));
                // 제재 후 필요한 추가 작업 수행
                alert('콘텐츠가 제재되었습니다.');
                navigate(0);
            } catch (error) {
                console.error('Error sanctioning content:', error);
                alert('콘텐츠 제재에 실패했습니다.');
            }
        }
    };

    const handledesanctionContent = async () => {
        if (window.confirm('해당 콘텐츠를 제재 해제하시겠습니까?')) {
            try {
                await Promise.all(selectedReports.map(reportedContentNo => {
                    return axios.patch(API_DOMAIN + '/admin/desanctioncontent', reportedContentNo, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }));
                // 제재 후 필요한 추가 작업 수행
                alert('콘텐츠가 제재 해제되었습니다.');
                navigate(0);
            } catch (error) {
                console.error('Error sanctioning content:', error);
                alert('콘텐츠 제재 해제에 실패했습니다.');
            }
        }
    };

    return (
        <div className="report-container">
            <div className="PostList">
                <h2>신고받은 글 / 댓글</h2>
            </div>

            <table className="report-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                id="all"
                                onChange={handleAllCheckboxChange}
                                checked={reportedData.length > 0 && selectedReports.length === reportedData.length}
                            />
                        </th>
                        <th>신고번호</th>
                        <th>userNo</th>
                        <th>ID</th>
                        <th>분류</th>
                        <th>내용</th>
                        <th>신고</th>
                        <th>콘텐츠 제재 여부</th>
                    </tr>
                </thead>
                <tbody>
                    {reportedData.map((report) => (
                        <tr key={report.reportedContentNo}>
                            <td>
                                <input
                                    type="checkbox"
                                    id="serviceTerms"
                                    onChange={() => handleCheckboxChange(report.reportedContentNo)}
                                    checked={selectedReports.includes(report.reportedContentNo)}
                                />
                            </td>
                            <td>{report.reportedContentNo}</td>
                            <td>{report.userNo}</td>
                            <td>{report.userId}</td>
                            <td>{report.boardNo ? "글" : "댓글"}</td>
                            <td>{report.content}</td>
                            <td>{new Date(report.reportedTime).toLocaleDateString()}</td>
                            <td>{report.censoredTime?report.censoredTime.split('T')[0] : ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="report-actions">
                <button className="report-delete" onClick={handleDelete}>삭제</button>
                <button className="cencored" onClick={handleContentRestriction}>제재</button>
                <button className="desanctionContent" onClick={handledesanctionContent}>제재 해제</button>
            </div>

            <div className="report-pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage <= 1}
                    className="report-page-button"
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page} 
                        onClick={() => handlePageChange(page)} 
                        className={`report-page-number ${page === currentPage ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage >= totalPages}
                    className="report-page-button"
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default Report;
