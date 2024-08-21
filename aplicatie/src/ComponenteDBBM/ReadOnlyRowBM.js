import React from 'react'
import { useState } from 'react';
import DeleteModalBM from "./DeleteModalBM";
import PopupOI from './ObInvPopUp';
import "../DataBaseBM.css";
import moment from 'moment';
import PrintableComponent from './PrintableComponent';

const ReadOnlyRowBM = ({ bon, handleDeleteClick, showRows }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [showModal, setShowModal] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  return (
    <tr>
      <td>BM {bon.NrBon}</td>
      <td>{bon.Gestiune.NrGestiune}. {bon.Gestiune.Nume}</td>
      <td>{moment(bon.Data, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')}</td>
      <td>{bon.IntocmitDe}</td>
      <td>{bon.PrimitDe}</td>
      <td>
        <div className="obiect-cell">
          <div style={{ marginRight: "10px" }}>{bon.NrObiecteInventar}</div>
          <button type='button' onClick={() => setShowModal(true)}>Detalii</button>
          {showModal && (
            <PopupOI
              showModal={showModal}
              setShowModal={setShowModal}
              bon={bon}
            />
          )}
        </div>
      </td>
      {showRows ? (
        <td colSpan='2'>
          <button type="button" onClick={() => setShowPrint(true)} style={{ marginRight: '10px' }}>
            Printați
          </button>
          {showPrint && (
            <PrintableComponent
              bonuri={bon}
              showPrint={showPrint}
              setShowPrint={setShowPrint}
            />
          )}
          <button type="button" onClick={toggleModal}>
            Ștergeți
          </button>
          {isModalOpen && (
            <DeleteModalBM
              handleDeleteClick={handleDeleteClick}
              Id={bon.Id}
              isModalOpen={isModalOpen}
              toggleModal={toggleModal}
            />
          )}
        </td>
      ) : (
        <td>
          <button type="button" onClick={() => setShowPrint(true)} style={{ marginRight: '10px' }}>
            Printați
          </button>
          {showPrint && (
            <PrintableComponent
              bonuri={bon}
              showPrint={showPrint}
              setShowPrint={setShowPrint}
            />
          )}
          <button type="button" onClick={toggleModal}>
            Ștergeți
          </button>
          {isModalOpen && (
            <DeleteModalBM
              handleDeleteClick={handleDeleteClick}
              Id={bon.Id}
              isModalOpen={isModalOpen}
              toggleModal={toggleModal}
            />
          )}

        </td>
      )}
    </tr>
  )
}

export default ReadOnlyRowBM;