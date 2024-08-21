import { axios } from '../axiosInstance';
import React, { useState } from 'react';
import Modal from 'react-modal';
import "../DataBaseDP.css";
import './AddGestiuni.css';

const AddGestiuni = ({ departament, showAdd, setShowAdd, setItemAdded }) => {

    const [gestiuneNoua, setGestiuneNoua] = useState({
        Nume: '',
        IdDepartament: '',
        Nr: ''
    });

    const handleAddFormChange1 = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        let fieldValue = event.target.value;

        const newFormData = { ...gestiuneNoua };

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
        setGestiuneNoua(newFormData);
    };

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newFormData = { ...gestiuneNoua };
        newFormData[fieldName] = fieldValue;

        setGestiuneNoua(newFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        if (gestiuneNoua.Nr === '') {
            alert("Numărul gestiunii nu poate fi lăsat liber!");
            return;
        }

        if (gestiuneNoua.Nr === 0) {
            alert("Numărul gestiunii nu poate avea valoarea 0!");
            return;
        }

        if (!gestiuneNoua.Nume) {
            alert("Numele gestiunii nu poate fi lăsat liber!");
            return;
        }

        if (gestiuneNoua.Nume.length > 200) {
            alert("Numele gestiunii nu depăși 200 de caractere!");
            return;
        }

        const newGestiune = {
            ...gestiuneNoua,
            IdDepartament: departament.Id
        };

        axios.post('http://dnndev.me/api/Mifix.Api/Gestiuni/New', newGestiune)
            .then((response) => {
                console.log(response.data);
                setItemAdded(true);
                setGestiuneNoua({
                    Nume: "",
                    IdDepartament: ""
                });
                setShowAdd(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert("A apărut o eroare la adăugarea gestiunii!");
                }
            });
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showAdd}
            onRequestClose={() => setShowAdd(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
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
            <div className="modal-contentaddges" >
                <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Formular de introducere a unei gestiuni</h2>
                <form onSubmit={handleAddFormSubmit} className="centered-form">
                    <label>
                        Departament Ales:
                    </label>
                    <input
                        className="input-outside-table"
                        type="text"
                        name="Departament"
                        value={departament.Nume}
                        title={departament.Nume}
                        readOnly
                    />
                    <label>
                        Număr Gestiune Nouă:
                    </label>
                    <input
                        className="input-outside-table"
                        type="text"
                        name="Nr"
                        step="1"
                        placeholder="Numărul noii gestiuni este ..."
                        onChange={handleAddFormChange1}
                        value={gestiuneNoua.Nr}
                    />
                    <label>
                        Nume Gestiune Nouă:
                    </label>
                    <input
                        className="input-outside-table"
                        type="text"
                        name="Nume"
                        placeholder="Numele gestiunii este ..."
                        onChange={handleAddFormChange}
                        value={gestiuneNoua.Nume}
                    />
                    <br />

                    <div className="button-container">
                        <button type="submit">Adăugați</button>
                        <button type="button" onClick={() => setShowAdd(false)}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddGestiuni