import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import './Loading.css';

const Loading = ({ loading }) => {

    const modalRoot = document.getElementById('modal-root');

    if (!loading) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay-loading">
            <div className="modal-content-loading">
                <FaSpinner className="spinner-icon" />
                <p>Se încarcă...</p>
            </div>
        </div>,
        modalRoot
    );
};

export default Loading;
