import React from 'react';
import ReactDOM from 'react-dom';
import '../../assets/styles/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content-login">
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;
