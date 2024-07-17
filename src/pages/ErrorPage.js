import React from 'react';
import Footer from '../components/common/Footer.js'; 
import Error from '../components/specific/Error.js'; 

function ErrorPage() {
  return (
    <div>
      <main>
        <Error />
      </main>
      <Footer />
    </div>
  );
}

export default ErrorPage;