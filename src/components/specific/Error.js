import React from "react";
import '../../assets/styles/Error.css';
import error from '../../assets/images/error.png';

const Error  = () => {

    return (

    <div className="error-page">
        <div className="sagongsa">
             <h1>4</h1>
             <img src={error} alt="404 Error" />
            <h1>4</h1>
        </div>
        <p>Page Not Found</p>
        
        <div className="button-error">
            <button className="button-action" onClick={() => window.location.href = '/community'}>Community Page</button>
            <button className="button-action" onClick={() => window.location.href = '/'}>Main Page</button>
        </div>
    </div>

    );
}

export default Error;