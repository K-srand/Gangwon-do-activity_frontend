import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/Report.css';
import { useNavigate } from 'react-router-dom';

function Report() {
    const navigate = useNavigate();
    const [reportedData, setReportedData] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);

    useEffect(() => {
        const fetchReportedData = async () => {
            try {
                const response = await axios.get('http://localhost:4040/api/v1/report/');
                setReportedData(response.data);
            } catch (error) {
                console.error('Error fetching reported data:', error);
            }
        };

        fetchReportedData();
    }, []);

    const handleDelete = async () => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await Promise.all(selectedReports.map(reportedContentNo => 
                    axios.patch(`http://localhost:4040/api/v1/report/delete/${reportedContentNo}`)
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
                        <th>ID</th>
                        <th>분류</th>
                        <th>내용</th>
                        <th>작성일</th>
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
                            <td>{report.userId}</td>
                            <td>{report.boardNo ? "글" : "댓글"}</td>
                            <td>{report.content}</td>
                            <td>{new Date(report.reportedTime).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="report-actions">
                <button className="report-delete" onClick={handleDelete}>삭제</button>
                <button className="cencored">제재</button>
                <button className="login-restriction">로그인 정지</button>
            </div>
        </div>
    );
}

export default Report;
