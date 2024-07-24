import React from 'react';
import Footer from '../components/common/Footer'; // Footer 경로에 맞게 수정
import Report from '../components/specific/Report'; 

function ReportPage() {
  return (
    <div>
      <main>
        <Report />
      </main>
      <Footer />
    </div>
  );
}

export default ReportPage;
