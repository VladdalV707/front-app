import React from 'react';
import Modal from 'react-modal';

const ConfirmSelect = ({ showConfirm, setShowConfirm, gestiune, setIsClicked, setShowGestiuni, setIsChosen, addFormData, setAddFormData }) => {

    const handleSelectClick = () => {

        setAddFormData({
            ...addFormData,
            Gestiune: {
                Id: gestiune.Id,
                Nume: `${gestiune.NrGestiune}. ${gestiune.Nume}`
            },
            Primitor: `${gestiune.Gestionar.Nume} ${gestiune.Gestionar.Prenume}`
        });

        setIsChosen(true);
        setShowConfirm(false);
        setShowGestiuni(false);
        setIsClicked(false);

    }

    const handleCloseClick = () => {
        setShowConfirm(false);
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showConfirm}
            onRequestClose={() => setShowConfirm(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 10000,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    border: 'none',
                    borderRadius: '5px',
                    overflow: 'auto',
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '100vh',
                }
            }}
        >
            <div className="modal-content-confirm-select" style={{ width: '100%' }}>
                <h3 style={{ maxWidth: '100%', wordWrap: 'break-word', marginBottom: '20px', textAlign: 'center' }}>Doriți să selectați gestiunea "{gestiune.NrGestiune}. {gestiune.Nume}"?</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type='button' style={{ marginRight: '10px' }} onClick={handleSelectClick}>Da</button>
                    <button type='button' onClick={handleCloseClick}>Nu</button>
                </div>
            </div>
        </Modal>
    );

}

export default ConfirmSelect
