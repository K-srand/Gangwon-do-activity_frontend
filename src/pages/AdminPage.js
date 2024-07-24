import React from 'react';
import Footer from '../components/common/Footer.js'; 
import Admin from '../components/specific/Admin.js'; 

function AdminPage() {
  return (
    <div>
      <main>
        <Admin/>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPage;