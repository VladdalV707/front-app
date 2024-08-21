import React from 'react'
import DeleteModalDrawerGES from './DeleteModalDrawerGES';
import { useState } from 'react';
import '../DrawerGES.css';

const ReadOnlyRowDWGES = ({ subgestiune, handleEditClick, handleDeleteClick, index }) => {

    /*Variabile Opțiuni*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    /*--*/

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{subgestiune.Nume}</td>
            <td>
                <button type="button" style={{ marginRight: '10px' }}
                    onClick={(event) => handleEditClick(event, subgestiune)}
                >
                    Editează
                </button>
                <button type="button" onClick={toggleModal}>
                    Șterge
                </button>
                {isModalOpen && (
                    <DeleteModalDrawerGES
                        handleDeleteClick={handleDeleteClick}
                        Id={subgestiune.Id}
                        isModalOpen={isModalOpen}
                        toggleModal={toggleModal}
                    />
                )}
            </td>
        </tr>
    )
}

export default ReadOnlyRowDWGES