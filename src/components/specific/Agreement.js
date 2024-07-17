import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/Agreement.css';

const Agreement = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({
        all: false,
        serviceTerms: false,
        privacyPolicy: false,
        dataProcessingPolicy: false,
        marketingInfo: false,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setCheckedItems((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const handleAllCheckboxChange = (event) => {
        const { checked } = event.target;
        setCheckedItems({
            all: checked,
            serviceTerms: checked,
            privacyPolicy: checked,
            dataProcessingPolicy: checked,
            marketingInfo: checked,
        });
    };

    const handleNextClick = () => {
        if (Object.values(checkedItems).slice(1).every(Boolean)) {
            navigate('/register');
        } else {
            alert('모든 약관에 동의해야 합니다.');
        }
    };

    return (
        <div className="agreement-container">
            <h1>서비스 약관 동의</h1>
            
            <div className="agreement-section-container">
                <div className="agreement-checkbox-container">
                    <input
                        type="checkbox"
                        id="all"
                        checked={checkedItems.all}
                        onChange={handleAllCheckboxChange}
                    />
                    <label htmlFor="all" className='agreement-label'>
                        본인은 아래의 모든 서비스 약관에 동의합니다.
                    </label>
                </div>
            </div>

            <div className="agreement-section-container">
                <div className="agreement-checkbox-container">
                    <input
                        type="checkbox"
                        id="serviceTerms"
                        checked={checkedItems.serviceTerms}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="serviceTerms" className='agreement-label'>
                        서비스 이용약관에 동의합니다. [필수]
                    </label>
                </div>
                <div className="agreement-section">
                    <div className="agreement-content">
                        <p>* 콘텐츠 권리: 이용자가 제작하여 게재한 게시물에 대한 지식재산권 등의 권리는 이용자에게 있습니다. 그러나 액티비티 강추!는 서비스 제공을 위해 해당 콘텐츠를 저장, 복제, 수정, 공중 송신, 전시, 배포 등의 권한을 가집니다.</p>
                        <p>* 개인정보 보호: 액티비티 강추!는 이용자의 개인정보를 수집, 이용하며, 관련 법령에 따라 안전하게 관리합니다. 일정 기간 로그인 기록이 없는 경우, 해당 정보를 파기하거나 분리 보관할 수 있습니다.</p>
                        <p>* 타인의 권리 존중: 이용자가 게시물로 타인의 저작권을 침해하거나 명예훼손 등의 행위를 해서는 안 됩니다​.</p>
                        <p>* 액티비티 강추!는 약관을 수시로 개정할 수 있으며, 중요한 변경 사항은 이메일 또는 서비스 내 알림으로 통지합니다. 이용자가 계속 서비스를 사용하는 경우 변경 사항을 수락한 것으로 간주됩니다.</p>
                        <p>* 이용 제한: 이용자가 공공질서 및 미풍양속을 해치는 경우, 범죄 행위와 관련된 경우, 타인의 명예를 손상시키는 경우 등 서비스 이용이 제한될 수 있습니다.</p>
                        <p>* 서비스 제공 중지: 전기통신사업법에 따른 서비스 중지, 정전, 설비 이전 등 불가피한 상황에서는 서비스 제공이 중지될 수 있습니다.</p>
                        <p>* 게시물 관리: 건전한 통신문화 정착을 위해, 이용자가 게시하는 자료가 특정 기준에 부합하지 않는 경우 회사는 이를 임의로 삭제할 수 있습니다​.</p>
                    </div>
                </div>
            </div>

            <div className="agreement-section-container">
                <div className="agreement-checkbox-container">
                    <input
                        type="checkbox"
                        id="privacyPolicy"
                        checked={checkedItems.privacyPolicy}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="privacyPolicy" className='agreement-label'>
                        개인정보처리방침에 동의합니다. [필수] 
                    </label>
                </div>
                <div className="agreement-section">
                    <div className="agreement-content">
                        <p>1. 개인정보 수집 항목 및 방법</p>
                        <p>* 수집 항목: 이름, 생년월일, 주소, 연락처, 이메일 주소, 로그인 기록 등 서비스 제공에 필요한 최소한의 개인정보를 수집합니다.</p>
                        <p>* 수집 방법: 인터넷 웹페이지에서 이용자가 직접 입력하거나, 서비스 이용 과정에서 자동으로 생성되어 수집될 수 있습니다.</p>
                        <p>* 보유 기간: 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 법령에서 정한 일정 기간 동안 보관이 필요한 경우 해당 기간 동안 안전하게 보관합니다.</p>
                        <p></p>
                        <p>2. 개인정보의 이용 목적</p>
                        <p>* 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 부정 이용 방지 등.</p>
                        <p>* 서비스 제공: 콘텐츠 제공, 맞춤 서비스 제공, 본인 인증 등.</p>
                        <p>* 서비스 개선: 새로운 서비스 개발 및 기존 서비스 개선을 위한 통계 분석 등</p>
                        <p></p>
                        <p>3. 개인정보의 제3자 제공 및 위탁</p>
                        <p>* 제공 원칙: 원칙적으로 이용자의 사전 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 의해 예외적으로 제공 의무가 발생하는 경우에는 관련 법령을 준수합니다.
                        </p>
                        <p>* 위탁 업무: 서비스 제공을 위해 일부 업무를 외부 업체에 위탁하며, 이 경우 위탁받은 업체가 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 관리/감독합니다.
                        </p>
                        <p>4. 개인정보의 보유 및 이용 기간</p>
                        <p>* 보유 기간: 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 법령에서 정한 일정 기간 동안 보관이 필요한 경우 해당 기간 동안 안전하게 보관합니다.</p>
                        <p></p>
                        <p>5. 이용자 및 법정대리인의 권리와 행사 방법</p>
                        <p>* 이용자 권리: 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보 제공에 대한 동의를 철회할 수 있습니다. 만 14세 미만 아동의 법정대리인은 아동의 개인정보 조회 및 수정, 동의 철회를 요청할 수 있습니다.</p>
                        <p>6. 개인정보의 안전성 확보 조치</p>
                        <p>* 보안 대책: 개인정보보호법 등 관계 법령에서 요구하는 수준 이상의 보안 대책을 통해 개인정보를 보호합니다. 이를 위해 다양한 기술적, 관리적 대책을 시행하고 있습니다.</p>
                        <p></p>
                        <p>7. 개인정보 처리방침의 변경에 관한 사항</p>
                        <p>* 변경 통지: 개인정보처리방침을 개정하는 경우, 변경 사항을 웹사이트 공지사항 또는 이메일을 통해 공지합니다. 변경된 방침은 공지한 날로부터 효력이 발생합니다.</p>
                    </div>
                </div>
            </div>

            <div className="agreement-section-container">
                <div className="agreement-checkbox-container">
                    <input
                        type="checkbox"
                        id="dataProcessingPolicy"
                        checked={checkedItems.dataProcessingPolicy}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="dataProcessingPolicy" className='agreement-label'>
                        개인정보위탁내용에 동의합니다. [필수]
                    </label>
                </div>
                <div className="agreement-section">
                    <div className="agreement-content">
                        <p>1. 개인정보 위탁 시 고지 사항</p>
                        <p>* 개인정보를 위탁할 경우, 위탁자는 다음 사항을 정보주체에게 알릴 의무가 있습니다:</p>
                        <p>* 위탁업무의 내용: 어떤 업무를 위해 개인정보를 위탁하는지 명확히 설명합니다.</p>
                        <p>* 수탁자의 정보: 개인정보를 처리할 수탁자의 명칭을 포함해야 합니다.</p>
                        <p>* 개인정보 처리의 범위: 수탁자가 처리할 개인정보의 범위를 명확히 합니다​.</p>
                        <p></p>
                        <p>2. 위탁업무 내용 공개 방법</p>
                        <p>* 위탁자는 위탁업무의 내용과 수탁자를 정보주체가 쉽게 확인할 수 있도록 지속적으로 공개해야 합니다. 공개 방법에는 다음과 같은 방법이 있습니다:</p>
                        <p>a. 인터넷 홈페이지에 게시</p>
                        <p>b. 사업장의 보기 쉬운 장소에 게시</p>
                        <p>c. 신문 또는 간행물을 통해 공지</p>
                        <p></p>
                        <p>3. 수탁자 관리 및 감독 의무</p>
                        <p>* 위탁자는 수탁자가 개인정보를 안전하게 처리하는지 정기적으로 관리/감독하고, 필요 시 교육을 실시해야 합니다. 수탁자 교육에는 다음 사항이 포함됩니다:</p>
                        <p>a. 개인정보의 분실, 도난, 유출, 변조 또는 훼손 방지</p>
                        <p>b. 개인정보 처리 현황 점검</p>
                        <p>c. 수탁자의 개인정보 보호법 준수 여부 확인</p>
                        <p></p>
                        <p>4. 위탁계약서에 포함해야 할 내용</p>
                        <p>* 개인정보처리 위탁계약서에는 다음 사항이 반드시 포함되어야 합니다:</p>
                        <p>a. 위탁업무 수행 목적 외 개인정보의 처리 금지</p>
                        <p>b.  개인정보의 기술적, 관리적 보호조치</p>
                        <p>c. 재위탁 제한</p>
                        <p>d. 개인정보 접근 제한 등 안전성 확보 조치</p>
                        <p>e. 개인정보 관리 현황 점검 및 감독 사항</p>
                        <p>f. 수탁자가 의무를 위반할 경우 손해배상 책임</p>
                        <p></p>
                        <p>5. 예시</p>
                        <p>* 액티비티 강추!와 같은 기업은 서비스 제공을 위해 일부 업무를 외부 업체에 위탁합니다.</p>
                        <p>* 액티비티 강추!는 수탁자가 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 관리/감독을 수행합니다.</p>
                        <p>* 위탁업무와 관련된 수탁자의 정보는 개인정보 처리방침에 명시되어 있으며, 변경 시에도 이를 공지합니다​ .</p>
                    </div>
                </div>
            </div>

            <div className="agreement-section-container">
                <div className="agreement-checkbox-container">
                    <input
                        type="checkbox"
                        id="marketingInfo"
                        checked={checkedItems.marketingInfo}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="marketingInfo" className='agreement-label'>
                        마케팅 정보 제공에 동의합니다. [필수]
                    </label>
                </div>
                <div className="agreement-section">
                    <div className="agreement-content">
                        <p>처리 목적:</p>
                        <p>액티비티 강추 및 제휴사의 상품과 서비스에 대한 광고, 홍보, 프로모션 제공.</p>
                        <p>액티비티 추천, 고객에게 적합한 서비스 추천 등의 맞춤형 서비스 제공.</p>
                        <p>광고 알림 발송.</p>
                        <p>수집 항목:</p>
                        <p>일반 개인정보: 이름 등.</p>
                        <p>액티비티 정보: 참여한 액티비티 명칭, 참여 일자, 활동 내역 등.</p>
                        <p>이용 및 보유 기간:</p>
                        <p>동의 철회 시 또는 회원 탈퇴 시까지 개인정보를 보유 및 이용.</p>
                        <p>수집 방법:</p>
                        <p>웹사이트에서 직접 입력, 서비스 이용 과정에서 자동으로 생성된 정보 수집.</p>
                        <p>마케팅 동의 유도 방법:</p>
                        <p>개인화 추천: 맞춤형 액티비티 추천을 통해 고객의 관심과 취향에 맞는 콘텐츠 제공.</p>
                        <p>마케팅 정보 제공 방식:</p>
                        <p>주요 매체: SMS 등.</p>
                        <p>동의 철회 방법: 고객센터를 통해 언제든지 마케팅 수신 동의를 철회할 수 있으며, 동의 철회가 다른 서비스 이용에 영향을 주지 않음.</p>
                        <p>예시:</p>
                        <p>마케팅 정보 제공에 대한 동의서</p>
                        <p>액티비티 강추(이하 "회사")는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다.</p>
                        <p>목적: 회사 및 제휴사의 상품과 서비스에 대한 광고, 홍보, 프로모션 제공.</p>
                        <p>수집 항목: 이름,  액티비티 참여 정보, 거래 내역.</p>
                        <p>보유 기간: 동의 철회 시 또는 회원 탈퇴 시까지.</p>
                    </div>
                </div>
            </div>
            
            <div className="agreement-buttons">
                <button className="agreement-button" onClick={handleNextClick}>다음</button>
                <button className="agreement-button" onClick={() => navigate('/')}>취소</button>
            </div>
        </div>
    );
};

export default Agreement;
