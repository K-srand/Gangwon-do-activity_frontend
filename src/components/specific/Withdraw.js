import React from 'react';
import '../../assets/styles/Certification.css';
import logo from '../../assets/images/MainLogo.png'; // 로고 import 추가

function Withdraw({ closeModal, setIsEmailVerified }) {

    



  return (
    <div className='certification-modal-main'>
      <div className='certification-modal-main-logo'>
        <img src={logo} alt='Logo'></img>
      </div>
      <div className='certification-modal-main-check-textbox'>
        <div className='bold'>회원 탈퇴시, 모든 기록은 말소됩니다.</div>
        <div className='detail'>회원 탈퇴를 원하신다면 아이디를 입력해주세요.</div>
      </div>
      <form>
        <div className='form-delete'>
          <input 
            type="text"
            placeholder="아이디 입력" /* 필요한 경우, 입력 필드에 플레이스홀더 추가 */
          />
        </div>
        <button type="submit">확인</button>
      </form>
    </div>
  );
}

export default Withdraw;
