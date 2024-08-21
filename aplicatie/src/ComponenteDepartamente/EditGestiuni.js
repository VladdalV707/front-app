import React, { useState } from 'react';
import Modal from 'react-modal';
import "../DataBaseDP.css";
import './EditGestiuni.css';
import ConfirmEdit from './ConfirmEdit';

const EditGestiuni = ({ showEdit, setShowEdit, departament, setItemEdited }) => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [gestiuneToEdit, setGestiuneToEdit] = useState(null);

    const handleEdit = (gestiune) => {
        setGestiuneToEdit(gestiune);
        setShowConfirm(true);
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showEdit}
            onRequestClose={() => setShowEdit(false)}
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
                <h3 style={{ margin: 0, border: '1px solid black', padding: '5px' }}>{departament.Nume}</h3>
            </div>

            <div className="modal-content-edit" >
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Nr. Gestiune + Denumire Gestiune</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Editare Gestiune</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {departament?.Gestiuni.map((gestiune) => (
                            <React.Fragment key={gestiune.Id}>
                                <div className="tr">
                                    <div className="td" style={{ textAlign: 'center' }} title={`${gestiune.NrGestiune}. ${gestiune.Nume}`}>{gestiune.NrGestiune}. {gestiune.Nume}</div>
                                    <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button type="button" onClick={() => handleEdit(gestiune)}>
                                            Editați
                                        </button>
                                    </div>
                                </div>
                                {showConfirm && gestiuneToEdit?.Id === gestiune.Id && (
                                    <ConfirmEdit
                                        showConfirm={showConfirm}
                                        setShowConfirm={setShowConfirm}
                                        gestiune={gestiune}
                                        setItemEdited={setItemEdited}
                                        setShowEdit={setShowEdit}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <button type='button' style={{ marginTop: '20px' }} onClick={() => setShowEdit(false)}>
                    Închideți
                </button>
            </div>

        </Modal>
    )
}

export default EditGestiuni