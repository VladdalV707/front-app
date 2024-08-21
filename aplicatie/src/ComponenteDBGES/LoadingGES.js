import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import './LoadingGES.css';

const LoadingGES = ({ loading }) => {

    const modalRoot = document.getElementById('modal-root');

    if (!loading) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay-loadingGES">
            <div className="modal-content-loadingGES">
                <FaSpinner className="spinner-icon" />
                <p>Se încarcă...</p>
            </div>
        </div>,
        modalRoot
    );
};

export default LoadingGES;
