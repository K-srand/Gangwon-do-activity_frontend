import React from 'react';
import Footer from '../components/common/Footer.js'; 
import AllUserList from '../components/specific/AllUserList.js'; 

function AllUserListPage() {
  return (
    <div>
      <main>
        <AllUserList/>
      </main>
      <Footer />
    </div>
  );
}

export default AllUserListPage;