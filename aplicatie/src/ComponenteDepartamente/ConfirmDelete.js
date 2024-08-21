import React from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';

const ConfirmDelete = ({ showConfirm, setShowConfirm, gestiune, setItemDeleted, setShowDelete }) => {

    const handleDeleteClick = () => {
        axios.delete(`http://dnndev.me/api/Mifix.Api/Gestiuni/Delete?Id=${gestiune.Id}`)
            .then(response => {
                setItemDeleted(true);
                setShowConfirm(false);
                setShowDelete(false);
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert("A apărut o eroare la ștergerea gestiunii!");
                }
            });
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
                    maxHeight: '100vh',
                }
            }}
        >
            <div className="modal-contentDGS" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                <h3 style={{ maxWidth: '80%', wordWrap: 'break-word', marginBottom: '20px', margin: '0 auto' }}>Doriți să ștergeți gestiunea cu numele "{gestiune.Nume}"?</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type='button' style={{ marginRight: '10px' }} onClick={handleDeleteClick}>Da</button>
                    <button type='button' onClick={handleCloseClick}>Nu</button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmDelete