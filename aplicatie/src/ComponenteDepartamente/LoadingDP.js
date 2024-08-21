import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import './LoadingDP.css';

const LoadingDP = ({ loading }) => {

    const modalRoot = document.getElementById('modal-root');

    if (!loading) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay-loadingDP">
            <div className="modal-content-loadingDP">
                <FaSpinner className="spinner-icon" />
                <p>Se încarcă...</p>
            </div>
        </div>,
        modalRoot
    );
};

export default LoadingDP;
