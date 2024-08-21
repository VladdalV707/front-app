import React, { useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';
import './ConfirmEdit.css';

const ConfirmEdit = ({ showConfirm, setShowConfirm, gestiune, setItemEdited, setShowEdit }) => {

    const [gestiuneToEdit, setGestiuneToEdit] = useState({
        Nume: gestiune.Nume,
        Nr: gestiune.NrGestiune
    })

    const handleAddFormChange1 = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        let fieldValue = event.target.value;

        const newFormData = { ...gestiuneToEdit };

        // Remove leading zeros from quantity or order number
        fieldValue = fieldValue.replace(/^0+(?=\d)/, "");

        // Convert input like '01' to '1'
        fieldValue = parseInt(fieldValue, 10).toString();

        // Validate and convert quantity to an integer greater than or equal to 0
        if (fieldName === "Nr") {
            const nrGestiune = fieldValue === "" ? "" : parseInt(fieldValue, 10);

            if (fieldValue === "" || isNaN(nrGestiune) || nrGestiune < 0) {
                newFormData[fieldName] = "";
            } else {
                newFormData[fieldName] = nrGestiune;

                // Prevent leading zeros
                if (newFormData[fieldName] !== "" && newFormData[fieldName] !== 0 && fieldValue.startsWith("0")) {
                    newFormData[fieldName] = parseInt(fieldValue, 10);
                }
            }

        }
        setGestiuneToEdit(newFormData);
    };

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newFormData = { ...gestiuneToEdit };
        newFormData[fieldName] = fieldValue;

        setGestiuneToEdit(newFormData);
    };

    const handleEditFormSubmit = (event) => {

        console.log("Obiectul de editat:", gestiuneToEdit);

        event.preventDefault();

        if (gestiuneToEdit.Nr === '') {
            alert("Numărul gestiunii nu poate fi lăsat liber!");
            return;
        }

        if (gestiuneToEdit.Nr === 0) {
            alert("Numărul gestiunii nu poate avea valoarea 0!");
            return;
        }

        if (!gestiuneToEdit.Nume) {
            alert("Numele gestiunii nu poate fi lăsat liber!");
            return;
        }

        if (gestiuneToEdit.Nume.length > 200) {
            alert("Numele gestiunii nu depăși 200 de caractere!");
            return;
        }

        axios.put(`http://dnndev.me/api/Mifix.Api/Gestiuni/Edit?Id=${gestiune.Id}`, gestiuneToEdit)
            .then(response => {
                setItemEdited(true);
                setShowConfirm(false);
                setShowEdit(false);
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert("A apărut o eroare la editarea gestiunii!");
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
            <div className="modal-contentedges" >
                <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Formular de editare a unei gestiuni</h2>
                <form onSubmit={handleEditFormSubmit} className="centered-form">
                    <label>
                        Număr Gestiune:
                    </label>
                    <input
                        className="input-outside-table"
                        type="text"
                        name="Nr"
                        step="1"
                        placeholder="Numărul noii gestiuni este ..."
                        onChange={handleAddFormChange1}
                        value={gestiuneToEdit.Nr}
                    />
                    <label>
                        Nume Gestiune:
                    </label>
                    <input
                        className="input-outside-table"
                        type="text"
                        name="Nume"
                        placeholder="Numele gestiunii este ..."
                        onChange={handleAddFormChange}
                        value={gestiuneToEdit.Nume}
                    />
                    <br />

                    <div className="button-container">
                        <button type="submit">Salvați</button>
                        <button type="button" onClick={handleCloseClick}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default ConfirmEdit