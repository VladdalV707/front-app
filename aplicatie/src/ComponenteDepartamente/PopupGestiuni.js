import React, { useState } from 'react'
import Modal from 'react-modal';
import "../DataBaseDP.css";
import './Popup.css';
import AddGestionar from './AddGestionar';
import DeleteGestionar from './DeleteGestionar';

const PopupGestiuni = ({ departament, showModal, setShowModal, setItemAdded, setItemDeleted }) => {

    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [gestiuneToDelete, setGestiuneToDelete] = useState(null);
    const [gestiuneToAdd, setGestiuneToAdd] = useState(null);

    const handleDelete = (gestiune) => {
        setGestiuneToDelete(gestiune);
        setShowDelete(true);
    };

    const handleAdd = (gestiune) => {
        setGestiuneToAdd(gestiune);
        setShowAdd(true);
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
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
                    maxHeight: '80%',
                }
            }}
        >

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, marginBottom: '10px' }}>Departament:</h2>
                <h4 style={{ margin: 0, border: '1px solid black', padding: '5px', wordWrap: 'break-word', textAlign: 'center', maxWidth: '100%' }}>{departament.Nume}</h4>
            </div>
            <div className="modal-content-popup" >
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Nr. Gestiune + Denumire Gestiune</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Nume Gestionar</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Adăugare/Ștergere Gestionari</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {departament?.Gestiuni.map((gestiune) => (
                            <React.Fragment key={gestiune.Id}>
                                <div className="tr">
                                    <div className="td" style={{ textAlign: 'center' }} title={`${gestiune.NrGestiune}. ${gestiune.Nume}`}>{gestiune.NrGestiune}. {gestiune.Nume}</div>
                                    <div className="td" style={{ textAlign: 'center' }} title={`${gestiune.Gestionar ? `${gestiune.Gestionar.Nume}  ${gestiune.Gestionar.Prenume}` : 'Nu există un gestionar atribuit!'}`}>
                                        {gestiune.Gestionar
                                            ? `${gestiune.Gestionar.Nume}  ${gestiune.Gestionar.Prenume}`
                                            : 'Nu există un gestionar atribuit!'
                                        }
                                    </div>
                                    <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                        {gestiune.Gestionar
                                            ? (
                                                <button type="button" onClick={() => handleDelete(gestiune)}>
                                                    Ștergeți
                                                </button>
                                            ) : (
                                                <button type="button" onClick={() => handleAdd(gestiune)}>
                                                    Adăugați
                                                </button>
                                            )
                                        }
                                    </div>

                                </div>
                                {showAdd && gestiuneToAdd?.Id === gestiune.Id && (
                                    <AddGestionar
                                        showAdd={showAdd}
                                        setShowAdd={setShowAdd}
                                        gestionar={gestiune.Gestionar}
                                        gestiune={gestiune}
                                        setItemAdded={setItemAdded}
                                        setShowModal={setShowModal}
                                    />
                                )}
                                {showDelete && gestiuneToDelete?.Id === gestiune.Id && (
                                    <DeleteGestionar
                                        showDelete={showDelete}
                                        setShowDelete={setShowDelete}
                                        gestionar={gestiune.Gestionar}
                                        gestiune={gestiune}
                                        setItemDeleted={setItemDeleted}
                                        setShowModal={setShowModal}
                                    />
                                )}


                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <button type='button' style={{ marginTop: '20px' }} onClick={() => setShowModal(false)}>
                    Închideți
                </button>
            </div>







        </Modal >
    )
}

export default PopupGestiuni