import React from 'react';
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import Recommend from '../components/specific/Recommend.js'; 

function RecommendPage(){
    return(
        <div>
      <main>
        <Recommend />
      </main>
      <Footer />
    </div>
    )
}

export default RecommendPage;