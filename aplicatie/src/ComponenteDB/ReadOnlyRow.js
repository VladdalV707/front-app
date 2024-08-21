import React from 'react'
import { useState } from 'react';
import DeleteModal from "./DeleteModal";
import PopupBUC from './BucPopUp';
import "../DataBase.css";

const ReadOnlyRow = ({ obiect, handleEditClick, handleDeleteClick }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [showModal, setShowModal] = useState(false);

  return (
    <tr>
      <td>{obiect.NumarDeOrdine}</td>
      <td>{obiect.NrFactura}</td>
      <td>{obiect.Furnizor}</td>
      <td>{obiect.DenumireObiect}</td>
      <td>
        <div className="obiect-cell">
          <div style={{ marginRight: "10px" }}>{obiect.NrBucati}</div>
          <button type="button" onClick={() => setShowModal(true)}>Detalii</button>
          {showModal && <PopupBUC showModal={showModal} setShowModal={setShowModal} obiect={obiect} />}
        </div>
      </td>
      <td>
        <button type="button"
          onClick={(event) => handleEditClick(event, obiect)}
          style={{ marginRight: '10px' }}
        >
          Editați
        </button>
        <button type="button" onClick={toggleModal}>
          Ștergeți
        </button>
        {isModalOpen && (
          <DeleteModal
            handleDeleteClick={handleDeleteClick}
            Id={obiect.Id}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
          />
        )}
      </td>
    </tr>
  )
}

export default ReadOnlyRow;