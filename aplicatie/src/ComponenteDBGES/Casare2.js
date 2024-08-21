import React, { useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';

const Casare2 = ({ user, ID, showCasare, setShowCasare, setShowModal, gestiune }) => {

    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleReturnClick = () => {
        axios.post(`http://dnndev.me/api/Mifix.Api/ObiecteInventar/Caseaza?idObiectInventar=${ID}`)
            .then(response => {
                console.log(response);
                setShowCasare(false);
                setShowModal(false);
            })
            .catch(error => {
                console.log(error);
                alert("A apărut o eroare la casarea obiectului!");
            });
    }

    const handleCloseClick = () => {
        setShowCasare(false);
    }



    return (
        <Modal
            ariaHideApp={false}
            isOpen={showCasare}
            onRequestClose={() => setShowCasare(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
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
                    maxHeight: '80%',
                }
            }}
        >
            <div className="modal-content-casare" style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '50%', wordWrap: 'break-word', marginBottom: '20px', textAlign: 'center', width: '100%' }}>
                        <span>Doriți să casați un obiect?</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            id="confirm-checkbox"
                            style={{ marginRight: '10px', width: '20px', height: '20px' }}
                            checked={isConfirmed}
                            onChange={() => setIsConfirmed(!isConfirmed)}
                        />

                        <label htmlFor="confirm-checkbox" style={{ flex: 1, width: '100%', maxWidth: '100%', wordWrap: 'break-word' }}>Casez obiectul și doresc să continui.</label>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type='button' style={{ marginRight: '10px' }} disabled={!isConfirmed} onClick={handleReturnClick}>
                        Da
                    </button>
                    <button type='button' onClick={handleCloseClick}>Nu</button>
                </div>
            </div>



        </Modal>
    )
}

export default Casare2