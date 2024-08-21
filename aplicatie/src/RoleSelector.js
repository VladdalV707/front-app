import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './RoleSelector.css';
import { axios } from './axiosInstance';

const RoleSelector = ({ selectedRole, setSelectedRole, currentUsername, setCurrentUsername }) => {

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(selectedRole === '');
    }, [selectedRole]);

    useEffect(() => {
        if (selectedRole !== "") {
            console.log('Selected Role:', selectedRole);
        }
    }, [selectedRole]);

    const handleAddFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://dnndev.me/api/Mifix.Api/Users/GetRolesTest?currentUsername=${currentUsername}`);
            const selectedRoleValue = response.data[0];

            if (selectedRoleValue === undefined) {
                setSelectedRole('GestionarSef');
            } else {
                setSelectedRole(selectedRoleValue);
            }
        } catch (error) {
            console.error(error);
            // handle error here, such as displaying an error message to the user
        }
    };



    const handleSelectChange = (e) => {
        const value = e.target.value;
        switch (value) {
            case 'Gestionar Șef':
                console.log('Setting currentUsername to gestionar_sef@unibv.ro');
                setCurrentUsername('gestionar_sef@unibv.ro');
                break;
            case 'Gestionar':
                console.log('Setting currentUsername to gestionar@unibv.ro');
                setCurrentUsername('gestionar@unibv.ro');
                break;
            case 'Personal':
                console.log('Setting currentUsername to personal@unibv.ro');
                setCurrentUsername('personal@unibv.ro');
                break;
            case 'Student':
                console.log('Setting currentUsername to student@unibv.ro');
                setCurrentUsername('student@unibv.ro');
                break;
            default:
                setCurrentUsername('');
        }
    };


    return (
        <Modal
            ariaHideApp={false}
            isOpen={showModal}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
                },
            }}
        >
            <div className="modal-content-rs">
                <h2 style={{ textAlign: 'center' }}>Formular de logare</h2>
                <form onSubmit={handleAddFormSubmit}>
                    <label>
                        Alegeți Utilizatorul:
                        <select onChange={handleSelectChange}>
                            <option value="Gestionar Șef">Gestionar Șef</option>
                            <option value="Gestionar">Gestionar</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </label>
                    <div className="button-container">
                        <button type="submit">Logare</button>
                        <button type="button" onClick={() => alert('Dacă nu vă logați, nu merge aplicația, ce faceți?')}>
                            Anulați
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default RoleSelector;
