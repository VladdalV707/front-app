import React from 'react'
import './DMDGES.css';
import ReactDOM from "react-dom";

const DeleteModalDrawerGES = ({ handleDeleteClick, Id, isModalOpen, toggleModal }) => {
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
            className={`modal-overlaydges ${isModalOpen ? "show" : "hide"}`}
            onClick={handleOverlayClick}
        >
            <div className="modal-content">
                <p>Ștergeți subgestiunea?</p>
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

export default DeleteModalDrawerGES