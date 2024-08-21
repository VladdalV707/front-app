import React from 'react';
import './DMD.css';
import ReactDOM from "react-dom";

const DeleteModalDrawer = ({ handleDeleteClick, Id, isModalOpen, toggleModal }) => {
    const modalRoot = document.getElementById("modal-root");

    const handleDelete = () => {
        handleDeleteClick(Id);
        toggleModal();
    };

    const handleOverlayClick = (event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) {
            toggleModal();
        }
    };

    return ReactDOM.createPortal(
        <div
            className={`modal-overlay ${isModalOpen ? "show" : "hide"}`}
            onClick={handleOverlayClick}
        >
            <div className="modal-content">
                <p>Ștergeți furnizorul?</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                    <button type="button" onClick={handleDelete} style={{ marginRight: '10px' }}>
                        Da
                    </button>
                    <button type="button" onClick={toggleModal}>
                        Nu
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default DeleteModalDrawer