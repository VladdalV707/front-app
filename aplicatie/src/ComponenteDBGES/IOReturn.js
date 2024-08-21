import React, { useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';

const IOReturn = ({ user, showReturn, setShowReturn, detaliu, setShowModal }) => {

    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleReturnClick = () => {
        axios.post(`http://dnndev.me/api/Mifix.Api/ObiecteInventar/Returneaza?idObiectInventar=${detaliu.IdObiectInventar}`)
            .then(response => {
                console.log(response);
                setShowReturn(false);
                setShowModal(false);
            })
            .catch(error => {
                console.log(error);
                alert("A apărut o eroare la returnarea obiectului!");
            });
    }

    const handleCloseClick = () => {
        setShowReturn(false);
    }



    return (
        <Modal
            ariaHideApp={false}
            isOpen={showReturn}
            onRequestClose={() => setShowReturn(false)}
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
            <div className="modal-content-return" style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '50%', wordWrap: 'break-word', marginBottom: '20px', textAlign: 'center', width: '100%' }}>
                        <span>
                            {detaliu.Serie ? `Doriți să returnați obiectul cu seria "${detaliu.Serie}"?` : 'Doriți să returnați obiectul?'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            id="confirm-checkbox"
                            style={{ marginRight: '10px', width: '20px', height: '20px' }}
                            checked={isConfirmed}
                            onChange={() => setIsConfirmed(!isConfirmed)}
                        />

                        <label htmlFor="confirm-checkbox" style={{ flex: 1, width: '100%', maxWidth: '100%', wordWrap: 'break-word' }}>Am primit obiectul de la posesor și doresc să continui.</label>
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

export default IOReturn