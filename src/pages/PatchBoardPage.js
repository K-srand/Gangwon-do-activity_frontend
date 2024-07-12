import React from 'react';
import Navbar from '../components/common/Navbar.js'; // Navbar 경로에 맞게 수정
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import PatchBoard from '../components/specific/PatchBoard.js'; // PatchBoard 경로에 맞게 수정

function PatchBoardPage(){
    return(
        <div>
      {/* <Navbar /> */}
      <main>
        <PatchBoard />
      </main>
      <Footer />
    </div>
    )
}

export default PatchBoardPage;