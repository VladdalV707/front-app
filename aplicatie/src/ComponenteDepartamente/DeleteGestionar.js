import React from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';

const DeleteGestionar = ({ showDelete, setShowDelete, gestionar, gestiune, setItemDeleted, setShowModal }) => {

    const handleDeleteClick = () => {
        axios.delete(`http://dnndev.me/api/Mifix.Api/Gestiuni/RemoveGestionar?Id=${gestiune.Id}`)
            .then(response => {
                setItemDeleted(true);
                setShowDelete(false);
                setShowModal(false);
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert("A apărut o eroare la ștergerea gestionarului!");
                }
            });
    }

    const handleCloseClick = () => {
        setShowDelete(false);
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showDelete}
            onRequestClose={() => setShowDelete(false)}
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
            <div className="modal-contentDG" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                <h3 style={{ maxWidth: '80%', wordWrap: 'break-word', marginBottom: '20px', margin: '0 auto' }}>Doriți să ștergeți gestionarul cu numele "{gestionar.Nume} {gestionar.Prenume}" din gestiunea "{gestiune.Nume}"?</h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type='button' style={{ marginRight: '10px' }} onClick={handleDeleteClick}>Da</button>
                    <button type='button' onClick={handleCloseClick}>Nu</button>
                </div>
            </div>

        </Modal>
    )
}

export default DeleteGestionar;
