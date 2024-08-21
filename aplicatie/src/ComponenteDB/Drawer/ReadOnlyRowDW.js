import React from 'react'
import DeleteModalDrawer from './DeleteModalDrawer';
import { useState } from 'react';
import '../Drawer.css';

const ReadOnlyRowDW = ({ furnizor, handleEditClick, handleDeleteClick, index }) => {

    /*Variabile Opțiuni*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    /*--*/

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{furnizor.Nume}</td>
            <td>
                <button type="button"
                    style={{ marginRight: '10px' }}
                    onClick={(event) => handleEditClick(event, furnizor)}
                >
                    Editează
                </button>
                <button type="button" onClick={toggleModal}>
                    Șterge
                </button>
                {isModalOpen && (
                    <DeleteModalDrawer
                        handleDeleteClick={handleDeleteClick}
                        Id={furnizor.Id}
                        isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                    />
                )}
            </td>
        </tr>
    )
}

export default ReadOnlyRowDW